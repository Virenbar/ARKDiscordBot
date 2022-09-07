import { Client, Collection, IntentsBitField } from "discord.js";
import log4js from "log4js";
import config from "./config.js";
import type { BotMessageMenuCommand, BotSlashCommand, BotUserMenuCommand } from "./models/index.js";

export class ARKBot extends Client<true> {
    constructor() {
        const myIntents = new IntentsBitField();
        myIntents.add(
            "GuildIntegrations",
            "Guilds", "GuildMessages",
            "DirectMessages", "DirectMessageReactions");
        super({ intents: myIntents });
        this.config = config.Config;
        this.logger = log4js.getLogger("ARKBot");
        this.commands = new Collection();
        this.userMenus = new Collection();
        this.messageMenus = new Collection();
    }
    public config;
    public logger;
    public commands: Collection<string, BotSlashCommand>;
    public userMenus: Collection<string, BotUserMenuCommand>;
    public messageMenus: Collection<string, BotMessageMenuCommand>;

    public reloadConfig(): void {
        config.loadConfig();
        this.config = config.Config;
    }
}
