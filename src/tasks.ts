import log4js from "log4js";
import { sleepS } from "./helpers/index.js";
import Activity from "./services/activity.js";
import ServerInfo from "./services/serverInfo.js";
import ServerStatus from "./services/serverStatus.js";
import StatusMessage from "./services/statusMessage.js";

const Logger = log4js.getLogger("Task");

function start() {
    activity();
    serverInfo();
    serverStatus();
    statusMessage();
}

async function activity() {
    Logger.debug("Starting: Activity");
    for (; ;) {
        try {
            await Activity.next();
        } catch (error) {
            Logger.error(error);
            await sleepS(10);
        }
    }
}

async function serverInfo() {
    const LoopWait = 30;
    await sleepS(LoopWait);
    for (; ;) {
        try {
            await ServerInfo.refresh();
            await sleepS(LoopWait);
        } catch (error) {
            Logger.error(error);
            await sleepS(LoopWait * 2);
        }
    }
}

async function serverStatus() {
    Logger.debug("Starting: Server Status");
    for (; ;) {
        try {
            await ServerStatus.refresh();
            await sleepS(30);
        } catch (error) {
            Logger.error(error);
        }
    }
}

async function statusMessage() {
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