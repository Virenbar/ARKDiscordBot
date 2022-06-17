import { ActivityOptions } from "discord.js";
import _ from "lodash";
import log4js from "log4js";
import { ARKBot } from "../ARKBot.js";
import { getPlural } from "../helpers/plural.js";
import { Module } from "../models";
import { sleep } from "../utils.js";
import { Servers } from "./serverInfo.js";

const Logger = log4js.getLogger("Activity");
const Activities: (() => Promise<void>)[] = [];
let Bot: ARKBot;
let Override = false;

function Initialize(bot: ARKBot) {
    Bot = bot;
}

async function Start() {
    let i = 0;
    Reload();
    for (; ;) {
        try {
            if (Override) {
                sleep(5 * 1000);
                continue;
            }
            await Activities[i++]();
            i = i % Activities.length;
        } catch (error) {
            Logger.error(error);
            await sleep(10 * 1000);
        }
    }
}

function Reload() {
    Activities.length = 0;
    Activities.push(PlayerCount);
    Activities.push(ServerCount);
}

async function PlayerCount() {
    const Online = _.sum(Servers.map(S => S.players.online));
    Bot.user.setActivity(`на ${Online} ${getPlural(Online, ...["игрока", "игроков"])}`, { type: "WATCHING" });
    await sleep(10 * 1000);
}

async function ServerCount() {
    const Online = Servers.filter(S => S.isOnline).length;
    Bot.user.setActivity(`${Online} из ${Servers.length} серверов`, { type: "LISTENING" });
    await sleep(10 * 1000);
}

export function SetActivity(activity: string, type: ActivityOptions) {
    Override = true;
    Bot.user.setActivity(activity, type);
}
export function ResetActivity() {
    Override = false;
}

const Module: Module = { Initialize, Start, Reload };
export default Module;
