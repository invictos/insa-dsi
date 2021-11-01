import * as DSI from "./api.js";
import { error } from "./common.js";

(async () => {
    // insaDSI upkeep <ROOM> <QTE>
    const argv = process.argv.slice(2);
    
    if(argv.length < 1){
        throw error("Must use subcommand");
    }

    switch(argv[0]){
        case "upkeep":
            await upkeep(argv);
            break;
        default:
            throw error("Unknown subcommand");
    }
})();


async function upkeep(argv: string[]){
    await DSI.connect();

    if(argv.length < 3){
        throw error("upkeep <rooms> <online_ratio>");
    }
    const rooms = argv[1]
                            .split(',')
                            .map(r => parseInt(r));

    const ratio = parseFloat(argv[2]);

    const started = await DSI.updateAndStartRooms(rooms, ratio);

    console.log(`💡 Started ${started} computers !`);
}