import { getLogger, Logger } from "log4js"

import { Bot } from "..";
import { ARKBot } from "../ARKBot"
import SI from "./serverInfo"
import SM from "./statusMessage"

export const ServerInfo = new SI()
const StatusMessage = new SM()

const Modules: Module[] = [ServerInfo, StatusMessage]

function LoadModules(client: ARKBot): void {
    client.on("ready", async () => {
        Modules.forEach(M => M.Start())
        //si.Run()
    })
}

function RunModules() {
    Modules.forEach(M => M.Start())
}

export default { LoadModules, RunModules }

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
