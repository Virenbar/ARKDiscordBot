import { Client, Collection, IntentsBitField, Snowflake, Team, User } from "discord.js";
import log4js from "log4js";
import config from "./config.js";
import {
    BotCommand,
    BotMessageMenuCommand,
    BotUserMenuCommand
} from "./models/index.js";

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
    }
    public config;
    public logger;
    public commands: Collection<string, BotCommand>;

    public userMenus() {
        return this.commands.filter((V) => V instanceof BotUserMenuCommand) as Collection<string, BotUserMenuCommand>;
    }

    public messageMenus() {
        return this.commands.filter((V) => V instanceof BotMessageMenuCommand) as Collection<string, BotMessageMenuCommand>;
    }

    public isOwner(id: Snowflake) {
        const O = this.application.owner;
        if (O instanceof User) {
            return O.id == id;
        } else if (O instanceof Team) {
            return O.ownerId == id;
        } else { return false; }
    }
    public isTeamMember(id: Snowflake) {
        const O = this.application.owner;
        if (O instanceof User) {
            return O.id == id;
        } else if (O instanceof Team) {
            return O.members.has(id);
        } else { return false; }
    }
    public reloadConfig(): void {
        config.loadConfig();
        this.config = config.Config;
    }
}
