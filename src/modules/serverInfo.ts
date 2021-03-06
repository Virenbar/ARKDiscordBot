import { queryGameServerInfo, queryGameServerPlayer } from "steam-server-query";
import { DateTime, Duration } from "luxon";
import log4js from "log4js";

import { sleep } from "../utils.js";
import { Config, Module } from "../models/index.js";
import { ARKBot } from "../ARKBot.js";

const LoopWait = 10 * 60 * 1000;
const Logger = log4js.getLogger("Server Info");
let Config: Config;
export const Servers: ARKServer[] = [];

function Initialize(_: ARKBot, config: Config) {
    Config = config;
}

async function Start(): Promise<void> {
    Reload();
    await Loop();
}

function Reload() {
    Servers.length = 0;
    let Index = 1;
    for (const server of Config.servers) {

        //const A = server.split(':')
        Servers.push({
            name: server.name,
            address: server.address,
            number: Index++,
            isOnline: false,
            players: {
                max: 0,
                online: 0,
                list: []
            },
            battlemetrics: server.battlemetrics,
            lastCheck: DateTime.now()
        });
    }
}

async function Loop() {
    await sleep(60 * 1000);
    for (; ;) {
        try {
            await CheckServers();
            await sleep(LoopWait);
        } catch (error) {
            Logger.error("Unknown error");
            Logger.error(error);
            await sleep(LoopWait * 2);
        }
    }
}

export async function CheckServers() {
    Logger.debug("Servers query started");
    for (const server of Servers) {
        await CheckServer(server);
        await sleep(1000);
    }
    Logger.debug("Servers query complete");
}

async function CheckServer(server: ARKServer): Promise<void> {
    try {
        const Info = await queryGameServerInfo(server.address);
        await sleep(200);
        const Players = await queryGameServerPlayer(server.address);

        //const R = await queryGameServerRules(server.address)
        server.isOnline = true;
        server.steamName = Info.name;
        server.map = Info.map;
        server.players.max = Info.maxPlayers;

        server.players.list = Players.players.filter(P => P.name.length > 0).map((P) => ({
            Name: P.name,
            Time: Duration.fromDurationLike({ seconds: P.duration })
        } as Player));
        server.players.online = server.players.list.length;
    } catch (error) {
        Logger.warn(`Error querying server: ${server.name}`);

        server.isOnline = false;
        server.players.max = 0;
        server.players.online = 0;
        server.players.list = [];
    }
    server.lastCheck = DateTime.now();

    //TODO Add saving to DB
}

export interface ARKServer {
    name: string
    address: string
    number?: number
    isOnline: boolean
    players: {
        online: number
        max: number
        list: Player[]
    },
    battlemetrics?: string
    steamName?: string
    map?: string
    lastCheck: DateTime
    history?: OnlineCount[]
}

interface Player {
    Name: string,
    Time: Duration
}

interface OnlineCount {
    Time: DateTime,
    Online: number
}

const Module: Module = { Initialize, Start, Reload };
export default Module;
