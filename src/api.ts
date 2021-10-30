import { REGEXS } from "./config.js";
import { authFetch } from "./login.js";

export interface Computer {
    id: number
    id_dsi: string
    id_url: string
    status: 'ON' | 'OFF'
    os: string
    os_date: string
    salle: string
    users: number
}

export async function startComputer(computer_id: number){
    console.log(("🍃 Starting computer " + computer_id));
    return authFetch.fetch(`https://dsi.insa-rouen.fr/salles/pc/${computer_id}/start/`);
}

export async function updateComputer(computer_id: number){
    console.log(("⏳ Updating computer informations: " + computer_id));
    return authFetch.fetch(`https://dsi.insa-rouen.fr/salles/pc/${computer_id}/update/`);
}

export async function getComputersByRooms(room_ids: number[]){
    return (await Promise.all(
        room_ids.map(
            room_id => getComputersByRoom(room_id)
        )))
        .flat()
        .sort((a, b) => a.id - b.id);
}

export async function getComputersByRoom(room_id: number){
    const url = `https://dsi.insa-rouen.fr/salles/${room_id}/`;
    const text = await (await authFetch.fetch(url)).text()

    const computers: Computer[] = [...text.matchAll(REGEXS.COMPUTER_LIST)]
        .map(computer => {
            return {
                id: parseInt(computer[1].split('/').slice(-2, -1)[0]),
                id_url: computer[1],
                id_dsi: computer[2],
                status: computer[3] == 'éteinte' ? 'OFF' : 'ON',
                os: computer[4],
                os_date: computer[5],
                salle: computer[6],
                users: parseInt(computer[7]),
                boot_url: computer[8]
            };
        })

    return computers;
}