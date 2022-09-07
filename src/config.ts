import fs from "fs";
import log4js from "log4js";
import path from "path";
import url from "url";
import type { Config } from "./models/index.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const logger = log4js.getLogger("Config");
const file = path.join(__dirname, "../config.json");
const Config: Config = {
    api: "",
    guild: "",
    channel: "",
    servers: [],
};

export function saveConfig(): void {
    const raw = JSON.stringify(Config);
    fs.writeFileSync(file, raw, { encoding: "utf8" });
    logger.info("Saved");
}

export function loadConfig(): void {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw) as Config;
    Config.guild = parsed.guild;
    Config.channel = parsed.channel;
    Config.servers = parsed.servers;
    Config.api = parsed.api;
    logger.info("Loaded");
    logger.debug(Config);
}

export default { Config, loadConfig, saveConfig };
