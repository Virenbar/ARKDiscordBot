import { Collection } from "discord.js";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v9"
import { REST } from "@discordjs/rest"
import path from "path";
import fs from "fs";

import { ARKBot } from "../ARKBot";
import { BotMenuCommand, BotSlashCommand } from "../models";

const PathC = path.join(__dirname, "./commands/")
//const PathCM = path.join(__dirname, "./menus/")

export const Commands = new Collection<string, BotSlashCommand>();
export const ContextMenus = new Collection<string, BotMenuCommand>();

async function LoadCommands(Bot: ARKBot): Promise<void> {
    try {
        Commands.clear()
        const commandFiles = fs.readdirSync(PathC).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const { default: CC } = await import(PathC + file)
            const SC: BotSlashCommand = new CC()
            Commands.set(SC.command.name, SC)
        }
        ContextMenus.clear()
        /*const menuFiles = fs.readdirSync(PathCM).filter(file => file.endsWith(".js"));
        for (const file of menuFiles) {
            const { default: CC } = await import(PathCM + file);
            const MC: BotMenuCommand = new CC()
            ContextMenus.set(MC.command.name, MC);
        }*/
        Bot.commands = Commands
        Bot.contexMenus = ContextMenus
    } catch (error) {
        Bot.logger.error("Error loading interactions module")
        Bot.logger.error(error)
    }
}

async function DeployCommands(Bot: ARKBot): Promise<void> {
    const s: RESTPostAPIApplicationCommandsJSONBody[] = []
    Bot.commands.each(c => s.push(c.command.toJSON()))
    Bot.contexMenus.each(c => s.push(c.command.toJSON()))

    const rest = new REST({ version: "10" }).setToken(Bot.token);
    await rest.put(
        Routes.applicationGuildCommands(Bot.application.id, Bot.config.guild),
        { body: s }
    )

    Bot.logger.info("Interactions deployed")
}

export default { LoadCommands, DeployCommands }
