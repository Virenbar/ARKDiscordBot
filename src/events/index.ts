import { ClientEvents, Collection } from "discord.js";
import fs from "fs";
import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";

export const Logger = log4js.getLogger("Event");
export let Client: ARKBot;
const Events = new Collection<string, TEventHandler>();

async function initialize(client: ARKBot) {
    Client = client;
    Logger.debug("Loading");
    const Folder = new URL(".", import.meta.url);
    const Files = fs.readdirSync(Folder).filter(file => file.endsWith(".js") && file != "index.js");
    for (const file of Files) {
        const File = new URL(file, Folder);
        const { default: Module } = await import(File.pathname);
        const Handler = Module as TEventHandler;
        Events.set(Handler.event, Handler);
        Logger.debug(`Loaded: ${Handler.event}`);
    }
    Events.forEach((handler) => {
        Client.on(handler.event, async (...args) => {
            try {
                await handler.execute(...args);
            } catch (error) {
                Logger.error(`Event handler: ${handler.event}`);
                Logger.error(error);
            }
        });
    });
    Client.events = Events;
    Logger.debug("Loading done");
}

export type Event = keyof ClientEvents
export type TEventHandler = EventHandler<Event>
export interface EventHandler<T extends Event> {
    event: T
    execute(...args: ClientEvents[T]): Promise<void>
}

export default { initialize };
