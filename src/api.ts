import { array_shuffle, error, infoError } from "./common.js";
import { REGEXS } from "./config.js";
import { authFetch, connect as loginConnect } from "./login.js";

export interface Computer {
    id: number
    id_dsi: string
    online: boolean
    os: string
    os_date: string
    salle: string
    users: number
}

var auth: authFetch;

export async function connect(logCredentials : boolean = false): Promise<void> {
    auth = await loginConnect(logCredentials).catch(e => {throw error("Can't login")});
}

async function fetch(url: string) {
    if (auth == undefined) {
        infoError("Must use DSI.connect() first !");
    }
    return auth.fetch(url);
}

export async function startComputer(computer_id: number): Promise<void> {
    console.log(("🍃 Starting computer " + computer_id));
    await fetch(`https://dsi.insa-rouen.fr/salles/pc/${computer_id}/start/`);
}

export async function updateComputer(computer_id: number): Promise<void> {
    console.log(("⏳ Updating computer informations: " + computer_id));
    await fetch(`https://dsi.insa-rouen.fr/salles/pc/${computer_id}/update/`);
}

export async function updateAndStartRooms(room_ids: number[], ratio_online: number): Promise<number> {
    return (await Promise.all(
        room_ids.map(r => updateAndStartRoom(r, ratio_online))
    )).reduce((a, b) => a + b, 0);
}

export async function updateAndStartRoom(room_id: number, ratio_online: number): Promise<number> {
    if (ratio_online < 0 || ratio_online > 1) {
        infoError("Ratio to start must be between 0 and 1");
    }

    //Update all the computers state
    await Promise.all(
        (await getComputersByRoom(room_id))
            .map(computer => updateComputer(computer.id))
    );

    //Get computers
    const computers = await getComputersByRoom(room_id);
    const computers_offline = computers.filter(e => !e.online);

    //Number of computers to start
    const target_online = Math.floor(computers.length * ratio_online);
    const nb_to_start = Math.max(0, computers_offline.length - (computers.length - target_online));

    //Start the computers
    await Promise.all(array_shuffle(computers_offline)
        .slice(0, nb_to_start)
        .map(computer => startComputer(computer.id)));

    return nb_to_start
}

export async function getComputersByRooms(room_ids: number[]): Promise<Computer[]> {
    return (await Promise.all(
        room_ids.map(
            room_id => getComputersByRoom(room_id)
        )))
        .flat()
        .sort((a, b) => a.id - b.id);
}

export async function getComputersByRoom(room_id: number): Promise<Computer[]> {
    const url = `https://dsi.insa-rouen.fr/salles/${room_id}/`;
    const text = await (await fetch(url)).text();
    const computers: Computer[] = [...text.matchAll(REGEXS.COMPUTER_LIST)]
        .map(computer => {
            return {
                id: parseInt(computer[2].split('/').slice(-2, -1)[0]),
                id_dsi: computer[3],
                online: computer[4] == 'normale',
                os: computer[5],
                os_date: computer[6],
                salle: computer[7],
                users: parseInt(computer[8])
            };
        }).sort((a, b) => a.id - b.id);

    return computers;
}