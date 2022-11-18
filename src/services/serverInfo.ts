import log4js from "log4js";
import { DateTime, Duration } from "luxon";
import { queryGameServerInfo, queryGameServerPlayer } from "steam-server-query";
import type { ARKBot } from "../ARKBot.js";
import { sleep } from "../helpers/index.js";
import type { Service } from "./index.js";

const Logger = log4js.getLogger("Server Info");
let Client: ARKBot;

export const Servers: ARKServer[] = [];

function initialize(client: ARKBot) {
    Client = client;
}

function reload() {
    Servers.length = 0;
    for (const server of Client.config.servers) {
        Servers.push({
            name: server.name,
            address: server.address,
            number: server.id,
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

async function refresh() {
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

const name = "Server Info";
const Service: Service = { name, initialize, reload };
const ServerInfo = { ...Service, refresh } as const;
export default ServerInfo;

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

