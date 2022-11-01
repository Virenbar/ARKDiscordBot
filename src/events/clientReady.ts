import type { ARKBot } from "../ARKBot.js";
import type { EventHandler } from "./index.js";

const event: EventHandler<"ready"> = {
    event: "ready",
    async execute(client: ARKBot): Promise<void> {
        client.logger.info(`Logged in as ${client.user.tag}!`);
        client.application.fetch();
    }
};

export default event;
