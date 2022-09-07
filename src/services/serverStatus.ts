import log4js from "log4js";
import fetch from "node-fetch";
import type { ARKBot } from "../ARKBot.js";

import { sleep } from "../helpers/index.js";
import type { Service } from "./index.js";

const Logger = log4js.getLogger("Server Status");

//let Config: Config;
let Client: ARKBot;
let API: string;
export const Servers: ARKServer[] = [];
export const Players: Player[] = [];

function Initialize(client: ARKBot) {
    Client = client;
}

async function Start(): Promise<void> {
    Reload();
    await Loop();
}

function Reload() {
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

async function Loop() {
    const LoopWait = 30 * 1000;
    await sleep(LoopWait);
    for (; ;) {
        try {
            await CheckStatus();
            await sleep(LoopWait);
        } catch (error) {
            Logger.error("Unknown error");
            Logger.error(error);
            await sleep(LoopWait * 2);
        }
    }
}

export async function CheckStatus() {
    try {
        const Result = await fetch(API);
        const a = await Result.json() as Status;
        Players.length = 0;
        Players.push(...a.players);
        Servers.forEach(S => {
            const server = a.servers.find(s => s.id == S.id);
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

export interface Status {
    servers: Server[];
    players: Player[];
}

export interface Player {
    server: string;
    name: string;
}

export interface Server {
    name: string;
    ip: string;
    port: number;
    maxplayers: number;
    players: number;
    status: boolean;
    id: number;
}

export interface ARKServer extends Server {
    battlemetrics?: string
}

const ServerStatus: Service = { Initialize, Start, Reload };
export default ServerStatus;
