import { Collection, CommandInteraction, ContextMenuInteraction, MessageContextMenuInteraction, UserContextMenuInteraction } from "discord.js";
import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord-api-types/v9"
import { ApplicationCommandType } from "discord-api-types/v10"
import { REST } from "@discordjs/rest"
import path from "path";
import fs from "fs";

import { Bot } from "..";

const PathC = path.join(__dirname, "./commands/")
const PathCM = path.join(__dirname, "./menus/")

export const Commands = new Collection<string, BotSlashCommand>();
export const ContextMenus = new Collection<string, BotMenuCommand>();

const bot = Bot

async function LoadCommands(): Promise<void> {
    try {
        Commands.clear()
        const commandFiles = fs.readdirSync(PathC).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const SC: BotSlashCommand = (await import(PathC + file))();
            Commands.set(SC.command.name, SC)
        }
        ContextMenus.clear()
        const menuFiles = fs.readdirSync(PathCM).filter(file => file.endsWith(".js"));
        for (const file of menuFiles) {
            const CMC: BotMenuCommand = (await import(PathCM + file))();
            ContextMenus.set(CMC.command.name, CMC);
        }
        bot.commands = Commands
        bot.contexMenus = ContextMenus
    } catch (error) {
        bot.logger.error("Error loading interactions module")
        bot.logger.error(error)
    }
}

async function DeployCommands(): Promise<void> {
    const s: RESTPostAPIApplicationCommandsJSONBody[] = []
    Bot.commands.each(c => s.push(c.command.toJSON()))
    Bot.contexMenus.each(c => s.push(c.command.toJSON()))

    const rest = new REST({ version: "9" }).setToken(Bot.token);
    await rest.put(
        Routes.applicationGuildCommands(Bot.user.id, Bot.config.guild),
        { body: s }
    )

    Bot.logger.info("Interactions deployed")
}

abstract class BotCommand {
    constructor() {
        this.userCooldown = 5
        this.guildCooldown = 0
        this.globalCooldown = 0
    }
    public userCooldown: number
    public guildCooldown: number
    public globalCooldown: number
}

export abstract class BotSlashCommand extends BotCommand {
    constructor(name: string) {
        super()
        this.isNSFW = false
        this.command = new SlashCommandBuilder().setName(name)
    }
    public command: SlashCommandBuilder
    public isNSFW: boolean
    public async run(i: CommandInteraction): Promise<void> {
        await this.execute(i)
    }
    public abstract execute(i: CommandInteraction): Promise<unknown>
    public name(): string { return this.command.name }
}

export abstract class BotMenuCommand extends BotCommand {
    constructor(name: string) {
        super()
        this.command = new ContextMenuCommandBuilder().setName(name)
    }
    public command: ContextMenuCommandBuilder
    public abstract execute(i: ContextMenuInteraction): unknown | Promise<unknown>
}

export abstract class BotUserMenuCommand extends BotMenuCommand {
    constructor(name: string) {
        super(name)
        this.command.setType(ApplicationCommandType.User)
    }
    public abstract execute(i: UserContextMenuInteraction): unknown | Promise<unknown>
}

export abstract class BotMessageMenuCommand extends BotMenuCommand {
    constructor(name: string) {
        super(name)
        this.command.setType(ApplicationCommandType.Message)
    }
    public abstract execute(i: MessageContextMenuInteraction): unknown | Promise<unknown>
}

export default { LoadCommands, DeployCommands }
