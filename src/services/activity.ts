import { ActivityOptions, ActivityType } from "discord.js";
import { t } from "i18next";
import _ from "lodash";
import type { ARKBot } from "../ARKBot.js";
import { sleepS } from "../helpers/index.js";
import type { Service } from "./index.js";
import { Servers } from "./serverInfo.js";

let Client: ARKBot;
let Override = false;
let i = 0;

const Activities = [
    playerCount,
    serverCount
];

function initialize(client: ARKBot) {
    Client = client;
}

export async function next() {
    if (Override) {
        await sleepS(5);
    }
    await Activities[i++]();
    i = i % Activities.length;
}

async function playerCount() {
    const count = _.sum(Servers.map(S => S.players.online));
    Client.user.setActivity(`на ${t("plural.playerD", { lng: "ru", count })}`, { type: ActivityType.Watching });
    await sleepS(10);
}

async function serverCount() {
    const Online = Servers.filter(S => S.isOnline).length;
    Client.user.setActivity(`${Online} из ${Servers.length} серверов`, { type: ActivityType.Listening });
    await sleepS(10);
}

export function set(activity: string, type: ActivityOptions) {
    Override = true;
    Client.user.setActivity(activity, type);
}
export function reset() {
    Override = false;
}
const name = "Activity";
const Service: Service = { name, initialize };
const Activity = { ...Service, set, reset, next };
export default Activity;
