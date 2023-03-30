import { ActivityOptions, ActivityType } from "discord.js";
import { t } from "i18next";
import _ from "lodash";
import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import { sleepS } from "../helpers/index.js";
import type { Service } from "./index.js";
import { PVEServers, PVPServers } from "./serverInfo.js";

const Logger = log4js.getLogger("Status Message");
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

async function start() {
    for (; ;) {
        try {
            await Activity.next();
        } catch (error) {
            Logger.error(error);
            await sleepS(30);
        }
    }
}

async function next() {
    if (Override) { await sleepS(5); }
    await Activities[i++]();
    i = i % Activities.length;
}

async function playerCount() {
    const servers = [...PVPServers, ...PVEServers];
    const count = _.sum(servers.map(S => S.players.online));
    Client.user.setActivity(`на ${t("plural.playerD", { lng: "ru", count })}`, { type: ActivityType.Watching });
    await sleepS(10);
}

async function serverCount() {
    const servers = [...PVPServers, ...PVEServers];
    const online = servers.filter(S => S.isOnline).length;
    Client.user.setActivity(`${online} из ${servers.length} серверов`, { type: ActivityType.Listening });
    await sleepS(10);
}

function setListening(name: string) { set(name, { type: ActivityType.Listening }); }

function setWatching(name: string) { set(name, { type: ActivityType.Watching }); }

function set(activity: string, type?: ActivityOptions) {
    Override = true;
    Client.user.setActivity(activity, type);
}

function reset() {
    Override = false;
}

const name = "Activity";
const Service: Service = { name, initialize, start };
const Activity = {
    ...Service, next,
    set, setListening, setWatching, reset
} as const;
export default Activity;
