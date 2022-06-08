import { Client, Intents } from "discord.js"
import { getLogger } from "log4js";

import Config, { ARKConfig } from "./services/config";

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
    }

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