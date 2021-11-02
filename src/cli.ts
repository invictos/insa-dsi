import * as DSI from "./api.js";
import { error } from "./common.js";

(async () => {
    // insaDSI upkeep <ROOM> <QTE>
    const argv = process.argv.slice(2);
    
    if(argv.length < 1){
        throw error("Must use subcommand");
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
        default:
            throw error("Unknown subcommand");
    }
})();

async function ustatus(argv: string[]){
    await update(argv);
    await status(argv);
}

async function status(argv: string[]){
    await DSI.connect();

    if(argv.length < 2){
        throw error("update <rooms>");
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