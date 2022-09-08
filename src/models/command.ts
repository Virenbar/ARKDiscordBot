import { ApplicationCommandType, ButtonStyle } from "discord-api-types/v10";
import {
    ButtonBuilder,
    ButtonInteraction,
    ChatInputCommandInteraction,
    CommandInteraction,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    SlashCommandBuilder,
    UserContextMenuCommandInteraction
} from "discord.js";

/**
 * Base bot command
 */
export abstract class BotCommand implements BotCommand {
    constructor() {
        this.userCooldown = 5;
        this.guildCooldown = 0;
        this.globalCooldown = 0;
    }
    public abstract command: SlashCommandBuilder | ContextMenuCommandBuilder
    public userCooldown = 5;
    public guildCooldown = 0;
    public globalCooldown = 0;
    public isGlobal = false;
    public isNSFW = false;
    public isOwnerOnly = false;
    public isTeamOnly = false;
    public abstract name(): string;
    public abstract execute(i: CommandInteraction): Promise<unknown>
}

/**
 * Chat input command
 */
export abstract class BotSlashCommand extends BotCommand {
    constructor(name: string) {
        super();
        this.command = new SlashCommandBuilder().setName(name);
    }
    public command: SlashCommandBuilder;
    public async run(i: ChatInputCommandInteraction): Promise<void> {
        await this.execute(i);
    }
    public abstract override execute(i: ChatInputCommandInteraction): Promise<unknown>;
    public name(): string {
        return this.command.name;
    }
}

/**
 * Base context menu command 
 */
export abstract class BotMenuCommand extends BotCommand {
    constructor(name: string) {
        super();
        this.command = new ContextMenuCommandBuilder().setName(name);
    }
    public command: ContextMenuCommandBuilder;
    public abstract override execute(i: ContextMenuCommandInteraction): Promise<unknown>;
    public name(): string {
        return this.command.name;
    }
}

/**
 * User context menu command
 */
export abstract class BotUserMenuCommand extends BotMenuCommand {
    constructor(name: string) {
        super(name);
        this.command.setType(ApplicationCommandType.User);
    }
    public abstract override execute(i: UserContextMenuCommandInteraction): Promise<unknown>;
}

/**
 * Message context menu command
 */
export abstract class BotMessageMenuCommand extends BotMenuCommand {
    constructor(name: string) {
        super(name);
        this.command.setType(ApplicationCommandType.Message);
    }
    public abstract override execute(i: MessageContextMenuCommandInteraction): Promise<unknown>;
}

export abstract class BotButton {
    constructor(name: string) {
        this.button = new ButtonBuilder({ customId: name, style: ButtonStyle.Primary });
    }
    public button: ButtonBuilder;
    public abstract execute(i: ButtonInteraction): Promise<unknown>;
}

export interface BotCommand {
    isChatInput(): this is BotSlashCommand;
    isUserMenu(): this is BotUserMenuCommand;
    isMessageMenu(): this is BotMessageMenuCommand
}
