import { Snowflake } from 'discord.js';
import fs from "fs"
import path from "path"

const file = path.join(__dirname, '../../config.json')

export let Config: ARK66Config

function Save(): void {

}

export function loadConfig(): void {
    const raw = fs.readFileSync(file, 'utf8')
    Config = JSON.parse(raw)
    //Bot.config = Config
    //Bot.logger.info(Config)
}

export interface ARK66Config {
    Channel: Snowflake,
    Servers: string[],
    Messages: Snowflake[]
}