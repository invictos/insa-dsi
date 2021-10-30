import { parse as cookieParse } from "cookie";
import fetch, { Response } from "node-fetch";
import { error, infoLog } from "./common.js";
import { SECRETS, REGEXS } from "./config.js";


export async function connect(){
    
    //Get needed variables for CAS login
    const [JSessionID, lt] = await step1();
    infoLog("JSessionID: " + JSessionID);
    infoLog("lt: " + lt);
    
    //CAS login. ticket_cookie can be used to log into other services afterwards
    const [ticket_cookie, ticket_url] = await step2(JSessionID, lt);
    infoLog("ticketCookie: " + ticket_cookie);
    infoLog("ticketUrl: " + ticket_url);
    
    //DSI website authentification. sessionID is the 
    const [crsfToken, sessionID] = await step3(ticket_url);
    infoLog("crsfToken: " + crsfToken);
    infoLog("sessionID: " + sessionID);

    authFetch.init(crsfToken, sessionID);
}

export async function step3(ticket: string){
    const url = `https://dsi.insa-rouen.fr/accounts/login/?next=%2Fsalles%2Feteintes%2F&ticket=${ticket}`;
    const r3 = await fetch(url, {
        redirect: 'manual'
    });

    const {csrftoken, sessionid} = getCookies(r3);
    return [csrftoken, sessionid];
}

export async function step2(JSessionID: string, lt: string){
    const url = `https://cas.insa-rouen.fr/cas/login;jsessionid=${ JSessionID }?service=https%3A%2F%2Fdsi.insa-rouen.fr%2Faccounts%2Flogin%2F%3Fnext%3D%252Fsalles%252Feteintes%252F`
    
    const urlParams = new URLSearchParams({
        username: SECRETS.username,
        password: SECRETS.password,
        lt: lt,
        _eventId: 'submit',
        submit: 'SE CONNECTER'
    });

    const r2 = await fetch(url, {
        headers: {
            'Cookie': `JSESSIONID=${ JSessionID }`
        },
        method: 'POST',
        body: urlParams,
        redirect: 'manual'
    });

    const ticket_cookie = getCookies(r2)['CASTGC'];
    
    const ticket_url = new URL(r2.headers.raw()['location'][0]).searchParams.get('ticket');

    return [ticket_cookie, ticket_url];
}

export async function step1(){
    const r1 = await fetch("https://cas.insa-rouen.fr/cas/login?service=https%3A%2F%2Fdsi.insa-rouen.fr%2Faccounts%2Flogin%2F%3Fnext%3D%252Fsalles%252Feteintes%252F");
    
    const JSessionID = getCookies(r1)['JSESSIONID'];

    const body  = await r1.text();
    const lt = body.match(REGEXS.LT)[1];

    return [JSessionID, lt];
}

function getCookies(r: Response){
    return r.headers.raw()['set-cookie']
        .map(str => cookieParse(str))
        .reduce((prev, curr) => {
            return {
                ...prev,
                ...curr
            }
        });
}

export class authFetch{
    static fct: (url: string) => Promise<Response>;

    static init(crsf: string, sessionID: string){
        authFetch.fct = function(url: string){
            return fetch(url, {
                headers: {
                    'Cookie': `csrftoken=${crsf};sessionid=${sessionID}`
                }
            })
        }
    } 
    
    static fetch(url: string){
        if(authFetch.fct == null){
            throw error("Must load function first");
        }
        return authFetch.fct(url);
    }
}