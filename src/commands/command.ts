import { ApplicationCommandType, ButtonStyle } from "discord-api-types/v10";
import {
    AutocompleteInteraction,
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
export abstract class BotCommand {
    constructor() {
        this.userCooldown = 5;
    }
    public userCooldown = 0;
    public guildCooldown = 0;
    public globalCooldown = 0;
    public isGlobal = false;
    public isNSFW = false;
    public isOwnerOnly = false;
    public name() { return this.command.name; }
    public abstract command: SlashCommandBuilder | ContextMenuCommandBuilder
    public abstract execute(i: CommandInteraction): Promise<unknown>
}

/**
 * Chat input command
 */
export abstract class BotSlashCommand extends BotCommand {
    public hasAutocomplete = false;
    constructor(name: string) {
        super();
        this.command = new SlashCommandBuilder().setName(name);
    }
    public command: SlashCommandBuilder;
    public abstract override execute(i: ChatInputCommandInteraction): Promise<unknown>;
}

/**
 * Autocomplete interface
 */
export interface AutocompleteCommand extends BotSlashCommand {
    handleAutocomplete(i: AutocompleteInteraction): Promise<unknown>
}

//#region Menu Commands

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

//#endregion

export abstract class BotButton {
    constructor(name: string) {
        this.button = new ButtonBuilder({ customId: name, style: ButtonStyle.Primary });
    }
    public button: ButtonBuilder;
    public abstract execute(i: ButtonInteraction): Promise<unknown>;
}
