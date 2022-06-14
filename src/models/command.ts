import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders"
import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, MessageButton, MessageContextMenuInteraction, UserContextMenuInteraction } from "discord.js"
import { ApplicationCommandType } from "discord-api-types/v10"

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

export abstract class BotButton {
    constructor(name: string) {
        this.button = new MessageButton({ customId: name, style: "PRIMARY" })
    }
    public button: MessageButton
    public abstract execute(i: ButtonInteraction): unknown | Promise<unknown>
}
