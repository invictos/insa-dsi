import { parse as cookieParse } from "cookie";
import fetch, { Response } from "node-fetch";
import { infoLog } from "./common.js";
import { SECRETS, REGEXS } from "./config.js";

export async function connect(logCredentials: boolean = false) {

    //Get needed variables for CAS login
    const [execution] = await step1();
    if(logCredentials){
        infoLog("execution: " + execution);
    }

    //CAS login. ticket_cookie can be used to log into other services afterwards
    const [ticket_cookie, ticket_url] = await step2(execution);
    
    if(logCredentials){
        infoLog("ticketCookie: " + ticket_cookie);
        infoLog("ticketUrl: " + ticket_url);
    }

    //DSI website authentification. sessionID is the 
    const [crsfToken, sessionID] = await step3(ticket_url);
    if(logCredentials){
        infoLog("crsfToken: " + crsfToken);
        infoLog("sessionID: " + sessionID);
    }

    return new authFetch(crsfToken, sessionID);
}

async function step3(ticket: string) {
    const url = `https://dsi.insa-rouen.fr/accounts/login/?next=%2Fsalles%2Feteintes%2F&ticket=${ticket}`;
    const r3 = await fetch(url, {
        redirect: 'manual'
    });

    const { csrftoken, sessionid } = getCookies(r3);
    return [csrftoken, sessionid];
}

async function step2(execution: string) {
    const url = `https://cas.insa-rouen.fr/cas/login?service=https%3A%2F%2Fdsi.insa-rouen.fr%2Faccounts%2Flogin%2F%3Fnext%3D%252Fsalles%252Feteintes%252F`

    const urlParams = new URLSearchParams({
        username: SECRETS.username,
        password: SECRETS.password,
        execution: execution,
        _eventId: 'submit',
    });

    const r2 = await fetch(url, {
        method: 'POST',
        body: urlParams,
        redirect: 'manual'
    });

    const ticket_cookie = getCookies(r2)['CASTGC'];

    const ticket_url = new URL(r2.headers.raw()['location'][0]).searchParams.get('ticket');

    return [ticket_cookie, ticket_url];
}

async function step1() {
    const r1 = await fetch("https://cas.insa-rouen.fr/cas/login?service=https%3A%2F%2Fdsi.insa-rouen.fr%2Faccounts%2Flogin%2F%3Fnext%3D%252Fsalles%252Feteintes%252F");

    const body = await r1.text();

    const execution = body.match(REGEXS.EXECUTION)[1];

    return [execution];
}

function getCookies(r: Response) {
    return r.headers.raw()['set-cookie']
        .map(str => cookieParse(str))
        .reduce((prev, curr) => {
            return {
                ...prev,
                ...curr
            }
        });
}

export class authFetch {
    fct: (url: string) => Promise<Response>;

    constructor(crsf: string, sessionID: string) {
        this.fct = function (url: string) {
            return fetch(url, {
                headers: {
                    'Cookie': `csrftoken=${crsf};sessionid=${sessionID}`
                }
            })
        }
    }

    fetch(url: string) {
        return this.fct(url);
    }
}