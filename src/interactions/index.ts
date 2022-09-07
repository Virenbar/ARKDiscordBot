import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v10";
import { Collection } from "discord.js";
import fs from "fs";
import path from "path";
import url from "url";
import type { ARKBot } from "../ARKBot.js";
import type {
    BotCommand,
    BotMessageMenuCommand,
    BotSlashCommand,
    BotUserMenuCommand
} from "../models/index.js";

export let Client: ARKBot;

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const Commands = new Collection<string, BotSlashCommand>();
const UserMenus = new Collection<string, BotUserMenuCommand>();
const MessageMenus = new Collection<string, BotMessageMenuCommand>();

async function LoadCommands<T extends BotCommand>(collection: Collection<string, T>, folder: string) {
    collection.clear();
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

        await LoadCommands(Commands, "commands");

        //await Load(UserMenus, "menus/user");
        //await Load(MessageMenus, "menus/message");

        // Commands.clear();
        // const PathC = path.join(__dirname, "./commands/");
        // const commandFiles = fs.readdirSync(PathC).filter(file => file.endsWith(".js"));
        // for (const file of commandFiles) {
        //     const { default: CC } = await import("./commands/" + file);
        //     const SC: BotSlashCommand = new CC();
        //     Commands.set(SC.command.name, SC);
        // }

        // UserMenus.clear();
        // const PathCM = path.join(__dirname, "./menus/user");
        // const menuFiles = fs.readdirSync(PathCM).filter(file => file.endsWith(".js"));
        // for (const file of menuFiles) {
        //     const { default: CC } = await import("./menus/user" + file);
        //     const MC: BotMenuCommand = new CC();
        //     UserMenus.set(MC.command.name, MC);
        // }
        Client.commands = Commands;
        Client.userMenus = UserMenus;
        Client.messageMenus = MessageMenus;
    } catch (error) {
        Client.logger.error("Error loading commands");
        Client.logger.error(error);
    }
}

async function DeployCommands(): Promise<void> {
    const global: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const local: RESTPostAPIApplicationCommandsJSONBody[] = [];

    // Local only for guilds from config
    Client.userMenus.each(c => local.push(c.command.toJSON()));
    Client.messageMenus.each(c => local.push(c.command.toJSON()));
    Client.commands.each(c => (c.isGlobal ? global : local).push(c.command.toJSON()));

    const rest = Client.rest;
    const guild = Client.config.guild;
    await rest.put(Routes.applicationGuildCommands(Client.application.id, guild), { body: local });
    await rest.put(Routes.applicationCommands(Client.application.id), { body: global });
    Client.logger.info("Commands deployed");
}

export default { Initialize, DeployCommands };
