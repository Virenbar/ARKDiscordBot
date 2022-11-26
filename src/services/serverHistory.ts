import log4js from "log4js";
import { DateTime, Duration } from "luxon";
import type { ARKBot } from "../ARKBot.js";
import { sleepS } from "../helpers/index.js";
import type { Service } from "./index.js";
import { ARKServer, Servers } from "./serverInfo.js";

const Logger = log4js.getLogger("Server History");
let Client: ARKBot;

export const History: ServerHistory[] = [];

function initialize(client: ARKBot) {
    Client = client;
    Client.config;
}

function reload() {
    History.length = 0;
    for (const server of Servers) {
        History.push({
            server: server,
            players: { data: [] }
        });
    }
}

async function refresh() {
    Logger.debug("History update started");
    for (const S of History) {

        //Player History
        const P = new URLSearchParams({
            start: DateTime.now().minus(Duration.fromDurationLike({ day: 1 })).toISO(),
            stop: DateTime.now().toISO(),
            resolution: "60"
        });
        const Result = await fetch(`https://api.battlemetrics.com/servers/${S.server.battlemetrics}/player-count-history?${P}`);
        S.players = await Result.json() as PlayerCountHistory;

        //Chart
        const Data = new URLSearchParams({
            data1: S.players.data.map(p => p.attributes.max).reverse().join(",")
        });
        S.playersChart = `https://quickchart.io/chart/render/zm-7de91f85-aae1-4638-b7aa-adf577d0280a?${Data}`;
        await sleepS(1);
    }
    Logger.debug("History update complete");
}
const name = "Server History";
const Service: Service = { name, initialize, reload };
const ServerHistory = { ...Service, refresh } as const;
export default ServerHistory;

interface ServerHistory {
    server: ARKServer
    players: PlayerCountHistory
    playersChart?: string
}

interface PlayerCountHistory {
    data: {
        type: string
        attributes: {
            timestamp: Date
            max: number
            value: number
            min: number
        }
    }[]
}

