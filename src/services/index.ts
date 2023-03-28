import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import Activity from "./activity.js";
import ServerInfo from "./serverInfo.js";
import ServerStatus from "./serverStatus.js";
import StatusMessage from "./statusMessage.js";
export const Logger = log4js.getLogger("Service");
const Services: Service[] = [];

function initialize(client: ARKBot): void {
    Logger.debug("Initializing");
    Services.push(...[Activity, ServerStatus, ServerInfo, StatusMessage]);
    Services.forEach(M => {
        M.initialize(client);
        Logger.debug(`Initialized: ${M.name}`);
    });
    Logger.debug("Initializing done");
}

function reload() {
    Logger.debug("Reloading");
    Services.forEach(M => {
        if (M.reload) {
            M.reload();
            Logger.debug(`Reloaded: ${M.name}`);
        }
    });
    Logger.debug("Reloading done");
}

function start() {
    Logger.debug("Starting");
    Services.forEach(M => {
        if (M.start) {
            M.start();
            Logger.debug(`Started: ${M.name}`);
        }
    });
    Logger.debug("Starting done");
}
export default { initialize, reload, start };

export interface Service {
    name: string
    initialize(client: ARKBot): void;
    reload?(): void;
    start?(): Promise<void> | void
}
