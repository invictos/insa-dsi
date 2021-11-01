import * as DSI from "./api.js";

(async () => {

    await DSI.connect();

    const started = await DSI.updateAndStartRooms([8, 9], 1);

    console.log(`💡 Started ${started} computers !`);

})();