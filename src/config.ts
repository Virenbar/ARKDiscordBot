import type { Snowflake } from "discord.js";
import fs from "fs";
import log4js from "log4js";

const Logger = log4js.getLogger("Config");
const file = new URL("../config.json", import.meta.url);
const Config: BotConfig = {
    channel: "",
    servers: [],
    api: ""
};

export function saveConfig(): void {
    const raw = JSON.stringify(Config);
    fs.writeFileSync(file, raw, { encoding: "utf8" });
    Logger.info("Saved");
}

export function loadConfig(): void {
    const raw = fs.readFileSync(file, "utf8");
    const json = JSON.parse(raw) as BotConfig;
    Config.channel = json.channel;
    Config.servers = json.servers;
    Config.api = json.api;
    Logger.info("Loaded");
}

export default { Config, loadConfig, saveConfig };

//#region Config
export interface BotConfig {
    channel: Snowflake;
    api: string;
    servers: {
        id: number;
        name: string;
        address: string;
        battlemetrics: string;
    }[];
}

//#endregion
