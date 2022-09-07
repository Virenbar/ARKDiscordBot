import type { ClientEvents } from "discord.js";
import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import CR from "./clientReady.js";
import IC from "./interactionCreate.js";
import MC from "./messageCreate.js";

const Logger = log4js.getLogger("Events");
const Handlers: EventHandler<keyof ClientEvents>[] = [];

function Initialize(Bot: ARKBot): void {
    Handlers.push(...[CR, IC, MC]);
    Handlers.forEach(e => {
        Bot.on(e.event, (...args) => ExecuteHandler(e, ...args));
    });
}

async function ExecuteHandler<T extends keyof ClientEvents>(handler: EventHandler<T>, ...args: ClientEvents[T]) {
    try {
        await handler.execute(...args);
    } catch (error) {
        Logger.error(`Event handler error: ${handler.name}`);
        Logger.error(error);
    }
}

export interface EventHandler<T extends keyof ClientEvents> {
    name: string
    event: T
    disabled?: boolean
    execute(...args: ClientEvents[T]): Promise<void>
}

export default { Initialize };

