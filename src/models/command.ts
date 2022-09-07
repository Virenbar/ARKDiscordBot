import { ApplicationCommandType, ButtonStyle } from "discord-api-types/v10";
import {
    ButtonBuilder,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    SlashCommandBuilder,
    UserContextMenuCommandInteraction
} from "discord.js";

export abstract class BotCommand {
    constructor() {
        this.userCooldown = 5;
        this.guildCooldown = 0;
        this.globalCooldown = 0;
    }
    public userCooldown: number;
    public guildCooldown: number;
    public globalCooldown: number;
    public abstract name(): string;
}

export abstract class BotSlashCommand extends BotCommand {
    constructor(name: string) {
        super();
        this.isNSFW = false;
        this.isGlobal = false;
        this.command = new SlashCommandBuilder().setName(name);
    }
    public command: SlashCommandBuilder;
    public isNSFW: boolean;
    public isGlobal: boolean;
    public async run(i: ChatInputCommandInteraction): Promise<void> {
        await this.execute(i);
    }
    public abstract execute(i: ChatInputCommandInteraction): Promise<unknown>;
    public name(): string {
        return this.command.name;
    }
}

export abstract class BotMenuCommand extends BotCommand {
    constructor(name: string) {
        super();
        this.command = new ContextMenuCommandBuilder().setName(name);
    }
    public command: ContextMenuCommandBuilder;
    public abstract execute(i: ContextMenuCommandInteraction): unknown | Promise<unknown>;
    public name(): string {
        return this.command.name;
    }
}

export abstract class BotUserMenuCommand extends BotMenuCommand {
    constructor(name: string) {
        super(name);
        this.command.setType(ApplicationCommandType.User);
    }
    public abstract override execute(i: UserContextMenuCommandInteraction): unknown | Promise<unknown>;
}

export abstract class BotMessageMenuCommand extends BotMenuCommand {
    constructor(name: string) {
        super(name);
        this.command.setType(ApplicationCommandType.Message);
    }
    public abstract override execute(i: MessageContextMenuCommandInteraction): unknown | Promise<unknown>;
}

export abstract class BotButton {
    constructor(name: string) {
        this.button = new ButtonBuilder({ customId: name, style: ButtonStyle.Primary });
    }
    public button: ButtonBuilder;
    public abstract execute(i: ButtonInteraction): unknown | Promise<unknown>;
}
