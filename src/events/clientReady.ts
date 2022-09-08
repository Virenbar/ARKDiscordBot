import type { ARKBot } from "../ARKBot.js";
import { Client } from "../index.js";
import type { EventHandler } from "./index.js";

const event: EventHandler<"ready"> = {
    name: "Client Ready",
    event: "ready",
    async execute(client: ARKBot): Promise<void> {
        Client.logger.info(`Logged in as ${client.user?.tag}!`);
        client.application.fetch();
    }
};

export default event;
