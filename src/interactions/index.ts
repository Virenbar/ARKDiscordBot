import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";
import { Collection } from "discord.js";
import fs from "fs";
import path from "path";
import url from "url";
import type { ARKBot } from "../ARKBot.js";
import type { BotCommand } from "../models/index.js";

export let Client: ARKBot;

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const Commands = new Collection<string, BotCommand>();

async function LoadCommands<T extends BotCommand>(collection: Collection<string, T>, folder: string) {
    const Folder = path.join(__dirname, folder);
    const Files = fs.readdirSync(Folder).filter(file => file.endsWith(".js"));
    for (const file of Files) {
        const File = `${url.pathToFileURL(path.join(Folder, file))}`;
        const { default: Constructor } = await import(File);//await import(`./${folder}/${file}`);
        const Command: T = new Constructor();
        collection.set(Command.name(), Command);
    }
}

async function Initialize(client: ARKBot) {
    Client = client;
    try {
        Commands.clear();
        await LoadCommands(Commands, "commands");

        //await Load(UserMenus, "menus/user");
        //await Load(MessageMenus, "menus/message");
        Client.commands = Commands;
    } catch (error) {
        Client.logger.error("Error loading commands");
        Client.logger.error(error);
    }
}

async function DeployCommands(): Promise<void> {
    const global: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const local: RESTPostAPIApplicationCommandsJSONBody[] = [];

    // Local only for guilds from config
    Client.commands.each(c => (c.isGlobal ? global : local).push(c.command.toJSON()));

    const rest = Client.rest;
    const guilds = Client.guilds.cache.keys();
    for (const guild of guilds) {
        await rest.put(Routes.applicationGuildCommands(Client.application.id, guild), { body: local });
    }
    await rest.put(Routes.applicationCommands(Client.application.id), { body: global },);
    Client.logger.info("Commands deployed");
}

export default { Initialize, DeployCommands };
