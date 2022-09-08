import type { Snowflake } from "discord.js";

export interface Config {
    channel: Snowflake;
    api: string;
    servers: {
        id: number;
        name: string;
        address: string;
        battlemetrics: string;
    }[];
}
