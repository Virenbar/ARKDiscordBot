import type { ARKBot } from "../ARKBot.js";
import serverInfo from "./serverInfo.js";
import statusMessage from "./statusMessage.js";
import activity from "./activity.js";
import serverStatus from "./serverStatus.js";

const Services: Service[] = [];

function Initialize(client: ARKBot): void {
    Services.push(...[activity, serverStatus, serverInfo, statusMessage]);
    Services.forEach(M => { M.Initialize(client); });
}

function Start() {
    Services.forEach(M => M.Start());
}

function Reload() {
    Services.forEach(M => M.Reload());
}

export default { Initialize, Start, Reload };

export interface Service {
    Initialize(client: ARKBot): void;
    Start(): Promise<void>;
    Reload(): void;
}
