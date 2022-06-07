import { Client, Intents } from "discord.js"

import { configure, getLogger, Logger } from "log4js";
import { ARK66Config } from "./config"

export class ARK66Bot extends Client<true> {
    constructor() {
        const myIntents = new Intents();
        myIntents.add(
            'GUILD_INTEGRATIONS',
            'GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS',
            'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS');

        super({ intents: myIntents })

        configure({
            appenders: {
                debugFile: { type: "file", filename: "logs/debug.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
                errorFile: { type: "file", filename: "logs/error.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
                console: { type: "console", layout: { type: "colored" } },
                errors: { type: 'logLevelFilter', appender: 'errorFile', level: 'error' }
            },
            categories: {
                default: { appenders: ["console", "debugFile", "errors"], level: "debug" }
            }
        });
        this.Logger = getLogger("ARK66")
        //this.Config = {}
    }

    /** Основные настройки
     * @type {ARK66Config}
     * @memberof DClient
     */
    public Config?: ARK66Config
    public Logger: Logger
}