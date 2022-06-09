import { Module } from "./module"
import { serverInfo } from "./serverInfo"
import { statusMessage } from "./statusMessage"

let Modules: Module[]

function LoadModules(): void {
    Modules = [serverInfo, statusMessage]
    /* client.on("ready", async () => {
         Modules.forEach(M => M.Start())
         //si.Run()
     })*/
}

function RunModules() {
    Modules.forEach(M => M.Start())
}

export default { LoadModules, RunModules }
