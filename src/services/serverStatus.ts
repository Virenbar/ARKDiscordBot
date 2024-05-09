import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import type { Service } from "./index.js";

const Logger = log4js.getLogger("Server Status");
let Client: ARKBot;
let API: string;
export const ServersPVP: ARKServer[] = [];
export const ServersPVE: ARKServer[] = [];

function initialize(client: ARKBot) {
    Client = client;
}

function reload() {
    ServersPVP.length = 0;
    for (const server of Client.config.PVP.servers) {
        ServersPVP.push({
            name: server.name,
            ip: "",
            port: 1000,
            players: 0,
            status: false,
            id: server.id,
            battlemetrics: server.battlemetrics
        });
    }
    API = Client.config.api;
}

async function refresh() {
    try {
        const Result = await fetch(API);
        const status = await Result.json() as Status;
        refreshServers(ServersPVP, status.cluster_pvp);
        refreshServers(ServersPVE, status.cluster_pve);
        Logger.debug("Status updated");
    } catch (error) {
        Logger.error("Status update failed");
        Logger.error(error);
    }
}

function refreshServers(servers: ARKServer[], cluster: Server[]) {
    servers.forEach(S => {
        const server = cluster.find(s => s.id == S.id);
        if (!server) { return; }
        S.ip = server.ip;
        S.port = server.port;
        S.players = server.players;
        S.status = server.status;
    });
}

const name = "Server Status";
const Service: Service = { name, initialize, reload };
const ServerStatus = { ...Service, refresh, ServersPVP, ServersPVE } as const;
export default ServerStatus;

export interface Status {
    cluster_pvp: Server[]
    cluster_pve: Server[]
    cluster_pvp_wipe: Server[]
    cluster_pvp_asa: Server[]
}

export interface Server {
    name: string
    ip: string
    port: number
    players: number
    status: boolean
    id: number
}

export interface ARKServer extends Server {
    battlemetrics?: string
}
