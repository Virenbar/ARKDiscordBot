import { Client, Collection, Intents } from "discord.js"
import log4js from "log4js";
import { BotMenuCommand, BotSlashCommand } from "./models/index.js";

export class ARKBot extends Client<true> {
    constructor() {
        const myIntents = new Intents();
        myIntents.add(
            "GUILD_INTEGRATIONS",
            "GUILDS", "GUILD_MESSAGES",
            "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS");
        super({ intents: myIntents })
        this.logger = log4js.getLogger("ARKBot")
        //this.config = Config.Config 
        this.commands = new Collection<string, BotSlashCommand>()
        this.contexMenus = new Collection<string, BotMenuCommand>()
    }

    public commands: Collection<string, BotSlashCommand>
    public contexMenus: Collection<string, BotMenuCommand>

    public logger
}
