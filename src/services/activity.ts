import { ActivityOptions, ActivityType } from "discord.js";
import _ from "lodash";
import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import { getPlural, sleep } from "../helpers/index.js";
import type { Service } from "./index.js";
import { Servers } from "./serverInfo.js";

const Logger = log4js.getLogger("Activity");
const Activities: (() => Promise<void>)[] = [];
let Client: ARKBot;
let Override = false;

function Initialize(client: ARKBot) {
    Client = client;
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
    Client.user.setActivity(`на ${Online} ${getPlural(Online, ...["игрока", "игроков", "игроков"])}`, { type: ActivityType.Watching });
    await sleep(10 * 1000);
}

async function ServerCount() {
    const Online = Servers.filter(S => S.isOnline).length;
    Client.user.setActivity(`${Online} из ${Servers.length} серверов`, { type: ActivityType.Listening });
    await sleep(10 * 1000);
}

export function SetActivity(activity: string, type: ActivityOptions) {
    Override = true;
    Client.user.setActivity(activity, type);
}
export function ResetActivity() {
    Override = false;
}

const Activity: Service = { Initialize, Start, Reload };
export default Activity;
