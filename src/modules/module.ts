import { getLogger, Logger } from "log4js"

import { Bot } from "..";
import { ARKBot } from "../ARKBot"

export abstract class Module {
    constructor(
        public name: string
    ) {
        this.bot = Bot
        this.logger = getLogger(`ARKBot - ${name}`)
        //this.Bot.on('reload', this.Reload)
    }

    bot: ARKBot
    logger: Logger

    public abstract Reload(): void
    public abstract Start(): Promise<void>
}
