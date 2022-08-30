import type { Snowflake } from "discord.js";

export interface Config {
    guild: Snowflake;
    channel: Snowflake;
    api: string;
    servers: {
        id: number;
        name: string;
        address: string;
        battlemetrics: string;
    }[];
}
