import log4js from "log4js";
import { sleepS } from "./helpers/index.js";
import Activity from "./services/activity.js";
import ServerInfo from "./services/serverInfo.js";
import StatusMessage from "./services/statusMessage.js";

const Logger = log4js.getLogger("Task");

function start() {
    activity();
    statusMessage();
}

async function activity() {
    Logger.debug("Starting: Activity");
    for (; ;) {
        try {
            await Activity.next();
        } catch (error) {
            Logger.error(error);
            await sleepS(30);
        }
    }
}

async function statusMessage() {
    Logger.debug("Starting: Status Message");
    for (; ;) {
        try {
            await ServerInfo.refresh();
            await StatusMessage.updateMessages();
        } catch (error) {
            Logger.error(error);
            await sleepS(5 * 60);
        }
    }
}

const Tasks = { start };
export default Tasks;
