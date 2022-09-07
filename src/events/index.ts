import type { ClientEvents } from "discord.js";
import type { ARKBot } from "../ARKBot.js";

import CR from "./clientReady.js";
import IC from "./interactionCreate.js";
import MC from "./messageCreate.js";

const Handlers: EventHandler<keyof ClientEvents>[] = [];

function Initialize(Bot: ARKBot): void {
    Handlers.push(...[CR, IC, MC]);
    Handlers.forEach(e => { Bot.on(e.event, e.execute); });
}

export interface EventHandler<T extends keyof ClientEvents> {
    name: string
    event: T
    disabled?: boolean
    execute(...args: ClientEvents[T]): Promise<void>

}

export default { Initialize };

