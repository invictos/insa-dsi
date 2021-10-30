import { getComputersByRooms, updateComputer } from "./api.js";
import { connect } from "./login.js";


(async () => {
    await connect();

    const computers = await getComputersByRooms([8,9]);

    updateComputer(1);
})();