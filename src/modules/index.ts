import { ARKBot } from "../ARKBot.js"
import { Module, Config } from "../models/index.js"
import serverInfo from "./serverInfo.js"
import statusMessage from "./statusMessage.js"

let Modules: Module[]

function Initialize(bot: ARKBot, config: Config): void {
    Modules = [serverInfo, statusMessage]
    Modules.forEach(M => {
        M.Initialize(bot, config)
    })
}

function Start() {
    Modules.forEach(M => M.Start())
}
function Reload() {
    Modules.forEach(M => M.Reload())
}
export default { Initialize, Start, Reload }
