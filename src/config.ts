import fs from "fs"
import path from "path"
import { Snowflake } from "discord.js";
import { getLogger } from "log4js";

const logger = getLogger("Config")
const file = path.join(__dirname, "../config.json")
const Config: ARKConfig = {
    guild: "",
    channel: "",
    servers: new Map<string, string>()
}

export function saveConfig(): void {
    const raw = JSON.stringify(Config)
    fs.writeFileSync(file, raw, { encoding: "utf8" })
    logger.info("Config Saved")
}

export function loadConfig(): void {
    const raw = fs.readFileSync(file, "utf8")
    const parsed = JSON.parse(raw) as ARKConfig
    Config.guild = parsed.guild
    Config.channel = parsed.channel
    Config.servers = parsed.servers
    logger.info("Config Loaded")
    logger.info(Config)
}

export interface ARKConfig {
    guild: Snowflake
    channel: Snowflake
    servers: Map<string, string>
}

export default { Config, loadConfig, saveConfig }
