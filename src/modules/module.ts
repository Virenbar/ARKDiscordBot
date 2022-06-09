import { getLogger, Logger } from "log4js"

import { Bot } from "..";
import { ARKBot } from "../ARKBot"

export abstract class Module {
    constructor(name: string) {
        this.name = name
        this.bot = Bot
        this.logger = getLogger(`ARKBot - ${name}`)
        //this.Bot.on('reload', this.Reload)
    }
    name: string
    bot: ARKBot
    logger: Logger

    public abstract Reload(): void
    public abstract Start(): Promise<void>
}
