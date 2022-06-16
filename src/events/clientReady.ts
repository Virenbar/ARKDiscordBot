import { Client } from "discord.js";
import { EventHandler } from "./index.js";
import { Bot } from "../index.js";

const event: EventHandler<"ready"> = {
    name: "Client Ready",
    event: "ready",
    async execute(client: Client): Promise<void> {
        Bot.logger.info(`Logged in as ${client.user?.tag}!`);
    }
};

export default event;
