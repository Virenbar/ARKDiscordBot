import type { ARKBot } from "../ARKBot";
import type { Config, Service } from "../models";
import serverInfo from "./serverInfo";
import statusMessage from "./statusMessage";
import activity from "./activity";

//import serverHistory from "./serverHistory.js";
let Modules: Service[];

function Initialize(bot: ARKBot, config: Config): void {
    Modules = [serverInfo, statusMessage, activity];
    Modules.forEach(M => {
        M.Initialize(bot, config);
    });
}

function Start() {
    Modules.forEach(M => M.Start());
}
function Reload() {
    Modules.forEach(M => M.Reload());
}
export default { Initialize, Start, Reload };
