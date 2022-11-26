import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import type { Service } from "./index.js";

const Logger = log4js.getLogger("Server Status");
let Client: ARKBot;
let API: string;
export const Servers: ARKServer[] = [];
export const Players: Player[] = [];

function initialize(client: ARKBot) {
    Client = client;
}

function reload() {
    Servers.length = 0;
    for (const server of Client.config.servers) {
        Servers.push({
            name: server.name,
            ip: "",
            port: 1000,
            maxplayers: 0,
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
        Players.length = 0;
        Players.push(...status.players);
        Servers.forEach(S => {
            const server = status.servers.find(s => s.id == S.id);
            if (!server) { return; }
            S.ip = server.ip;
            S.port = server.port;
            S.maxplayers = server.maxplayers;
            S.players = server.players;
            S.status = server.status;
        });
        Logger.debug("Status updated");
    } catch (error) {
        Logger.error("Status update failed");
        Logger.error(error);
    }
}

const name = "Server Status";
const Service: Service = { name, initialize, reload };
const ServerStatus = { ...Service, refresh, Servers, Players } as const;
export default ServerStatus;

export interface Status {
    servers: Server[]
    players: Player[]
}

export interface Player {
    server: string
    name: string
    tribe: string | null
}

export interface Server {
    name: string
    ip: string
    port: number
    maxplayers: number
    players: number
    status: boolean
    id: number
}

export interface ARKServer extends Server {
    battlemetrics?: string
}

