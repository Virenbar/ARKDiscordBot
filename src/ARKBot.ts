import { Client, Collection, IntentsBitField, Snowflake, Team, User } from "discord.js";
import log4js from "log4js";
import {
    BotCommand,
    BotMessageMenuCommand,
    BotUserMenuCommand
} from "./commands/command.js";
import Commands from "./commands/index.js";
import Config from "./config.js";
import Events, { TEventHandler } from "./events/index.js";
import Services from "./services/index.js";

export class ARKBot extends Client<true> {
    constructor(token: string) {
        const myIntents = new IntentsBitField();
        myIntents.add(
            "GuildIntegrations",
            "Guilds", "GuildMessages",
            "DirectMessages", "DirectMessageReactions");
        super({ intents: myIntents });
        this.token = token;
        this.config = Config.Config;
        this.logger = log4js.getLogger("ARKBot");
        this.commands = new Collection();
        this.events = new Collection();
    }
    public config;
    public logger;
    public commands: Collection<string, BotCommand>;
    public events: Collection<string, TEventHandler>;
    public async initialize() {
        await Events.initialize(this);
        await Commands.initialize(this);
        Services.initialize(this);
    }
    public reload(): void {
        Config.loadConfig();
        Services.reload();
    }
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
            return O.members.has(id);
        } else { return false; }
    }
}
