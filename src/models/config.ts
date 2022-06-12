import { Snowflake } from "discord.js"

export interface Config {
    guild: Snowflake
    channel: Snowflake
    servers: {
        name: string
        address: string
    }[]
}
