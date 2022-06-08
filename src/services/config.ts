import fs from "fs"
import path from "path"
import { Snowflake } from "discord.js";
import { getLogger } from "log4js";

const logger = getLogger("Config")
const file = path.join(__dirname, "../../config.json")
const Config: ARKConfig = {
    Channel: "",
    Servers: new Map<string, string>(),
    Messages: []
}

export function saveConfig(): void {
    const raw = JSON.stringify(Config)
    fs.writeFileSync(file, raw, { encoding: "utf8" })
    logger.info("Config Saved")
}

export function loadConfig(): void {
    const raw = fs.readFileSync(file, "utf8")
    const parsed = JSON.parse(raw) as ARKConfig
    Config.Channel = parsed.Channel
    Config.Servers = parsed.Servers
    Config.Messages = parsed.Messages
    logger.info("Config Loaded")
    logger.info(Config)
}

export interface ARKConfig {
    Channel: Snowflake,
    Servers: Map<string, string>,
    Messages: Snowflake[]
}

export default { Config, loadConfig, saveConfig }
