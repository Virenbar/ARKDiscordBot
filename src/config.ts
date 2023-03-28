import type { Snowflake } from "discord.js";
import fs from "fs";
import log4js from "log4js";

const Logger = log4js.getLogger("Config");
const file = new URL("../config.json", import.meta.url);
const Config: BotConfig = {
    api: "",
    showCharts: false,
    PVP: {
        channel: "",
        servers: []
    },
    PVE: {
        channel: "",
        servers: []
    }
};

export function saveConfig(): void {
    const raw = JSON.stringify(Config);
    fs.writeFileSync(file, raw, { encoding: "utf8" });
    Logger.info("Saved");
}

export function loadConfig(): void {
    const raw = fs.readFileSync(file, "utf8");
    const json = JSON.parse(raw) as BotConfig;
    Config.api = json.api;
    Config.showCharts = json.showCharts;
    Config.PVP = json.PVP;
    Config.PVE = json.PVE;
    Logger.info("Loaded");
}

export default { Config, loadConfig, saveConfig };

//#region Config
export interface BotConfig {
    api: string
    showCharts: boolean
    PVP: ServerList
    PVE: ServerList
}
export interface ServerList {
    channel: Snowflake
    servers: Server[]
}
export interface Server {
    id: number
    name: string
    address: string
    battlemetrics: string
}
//#endregion
