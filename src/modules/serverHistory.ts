import log4js from "log4js";
import { DateTime, Duration } from "luxon";
import fetch from "node-fetch";
import { ARKBot } from "../ARKBot.js";
import { Config, Module } from "../models/index.js";
import { sleep } from "../utils.js";
import { ARKServer, Servers } from "./serverInfo.js";

const Logger = log4js.getLogger("Server History");
let Config: Config;
export const History: ServerHistory[] = [];

function Initialize(_: ARKBot, config: Config) {
    Config = config;
}
async function Start() {
    Reload();
    await Loop();
}
function Reload() {
    History.length = 0;
    for (const server of Servers) {
        History.push({
            server: server,
            players: { data: [] }
        });
    }
}

async function Loop() {
    try {
        await UpdateHistory();
        await sleep(30 * 60 * 1000);
    } catch (error) {
        Logger.error(error);
        await sleep(5 * 60 * 1000);
    }
}

async function UpdateHistory() {
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
        await sleep(1000);
    }
    Logger.debug("History update complete");
}

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
const Module: Module = { Initialize, Start, Reload };
export default Module;
