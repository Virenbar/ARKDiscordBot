import { Client, Collection, Intents } from "discord.js"
import { getLogger } from "log4js";
import { BotMenuCommand, BotSlashCommand } from "./interactions";

import Config, { ARKConfig } from "./config";

export class ARKBot extends Client<true> {
    constructor() {
        const myIntents = new Intents();
        myIntents.add(
            "GUILD_INTEGRATIONS",
            "GUILDS", "GUILD_MESSAGES",
            "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS");
        super({ intents: myIntents })
        this.logger = getLogger("ARKBot")
        this.config = Config.Config
        this.commands = new Collection<string, BotSlashCommand>()
        this.contexMenus = new Collection<string, BotMenuCommand>()
        this.loadConfig()
    }

    public commands: Collection<string, BotSlashCommand>
    public contexMenus: Collection<string, BotMenuCommand>
    /**
     * saveConfig{ ARKConfig, Config, loadConfig, saveConfig }
     */
    public saveConfig() {
        Config.saveConfig()
    }
    /**
     * loadConfig
     */
    public loadConfig() {
        Config.loadConfig()
    }

    /** Основные настройки
     * @type {config.ARKConfig}
     * @memberof ARKBot
     */
    public config: ARKConfig
    public logger
}
