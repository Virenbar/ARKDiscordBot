import { Collection, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import fs from "fs";
import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import type { BotCommand } from "./command.js";
export * from "./command.js";
export const Logger = log4js.getLogger("Command");
export let Client: ARKBot;
const Commands = new Collection<string, BotCommand>();

async function initialize(client: ARKBot): Promise<void> {
    Client = client;
    Logger.debug("Loading");
    Commands.clear();
    await LoadCommands(Commands, "slash");
    await LoadCommands(Commands, "user");

    //await LoadCommands(Commands, "message");
    //await LoadCommands(Commands, "wip");
    Client.commands = Commands;
    Logger.debug("Loading done");
}

export async function deployCommands() {
    Logger.info("Deploying");
    const global: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const local: RESTPostAPIApplicationCommandsJSONBody[] = [];

    // Local only for guilds
    Client.commands.each(c => (c.isGlobal ? global : local).push(c.command.toJSON()));

    const rest = Client.rest;
    const guilds = Client.guilds.cache.keys();
    for (const guild of guilds) {
        await rest.put(Routes.applicationGuildCommands(Client.application.id, guild), { body: local });
    }
    await rest.put(Routes.applicationCommands(Client.application.id), { body: global },);
    Logger.info("Deployed");
}

async function LoadCommands<T extends BotCommand>(collection: Collection<string, T>, folder: string) {
    const Folder = new URL(folder + "/", import.meta.url);
    if (!fs.existsSync(Folder)) { return; }
    const Files = fs.readdirSync(Folder).filter(file => file.endsWith(".js"));
    for (const file of Files) {
        const File = new URL(file, Folder);
        const { default: Module } = await import(File.pathname);
        const Constructor: CommandConstructorType<T> = Module;
        const Command: T = new Constructor();
        collection.set(Command.name(), Command);
        Logger.debug(`Loaded: ${Command.name()}`);
    }
}

type CommandConstructorType<T extends BotCommand> = new () => T;
export default { initialize, deployCommands };
