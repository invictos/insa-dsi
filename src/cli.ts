import * as DSI from "./api.js";
import { error } from "./common.js";

(async () => {
    // insaDSI upkeep <ROOM> <QTE>
    const argv = process.argv.slice(2);
    
    if(argv.length < 1){
        help();
        return;
    }

    switch(argv[0]){
        case "update":
            await update(argv);
            break;
        case "upkeep":
            await upkeep(argv);
            break;
        case "status":
            await status(argv);
            break;
        case "ustatus":
            await ustatus(argv);
            break;
        case "help":
            help();
            break;
        default:
            throw error("Unknown command");
    }
})()
.catch(error => {
    console.log(error);
    help();
});

function help() {
    console.log(`Usage:
    insaDSI update <rooms> : update the status of the computers in room(s)
    insaDSI upkeep <rooms> <online_ratio> : Load online_ratio of computers in each room(s)
    insaDSI status <rooms> : Show computers status in room(s)
    insaDSI help: Show this help

    To specify multiple rooms, use coma: 8,9
    `);
}

async function ustatus(argv: string[]){
    await update(argv);
    await status(argv);
}

async function status(argv: string[]){
    await DSI.connect();

    if(argv.length < 2){
        throw error("status <rooms>");
    }

    const computers = await DSI.getComputersByRooms(parseRooms(argv[1]));

    computers
        .sort((a, b) => a.id_dsi.localeCompare(b.id_dsi))
        .forEach(c => {
            const status = c.online ? '🟢' : '🔴';
            console.log(`💻 ${status} ${c.id_dsi}.insa-rouen.fr`);
        });
}

async function update(argv: string[]){
    await DSI.connect();

    if(argv.length < 2){
        throw error("update <rooms>");
    }
    
    const rooms = parseRooms(argv[1]);

    await DSI.updateRooms(rooms);

}

async function upkeep(argv: string[]){
    await DSI.connect();

    if(argv.length < 3){
        throw error("upkeep <rooms> <online_ratio>");
    }
    const rooms = parseRooms(argv[1]);

    const ratio = parseFloat(argv[2]);

    const started = await DSI.updateAndStartRooms(rooms, ratio);

    console.log(`💡 Started ${started} computers !`);
}

function parseRooms(arg: string){
    return arg.split(',')
        .map(r => parseInt(r));
}