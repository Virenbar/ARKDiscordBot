import "dotenv/config"

import Interactions from "./interactions";
import Modules from "./modules"
import Events from "./events"
import { configure } from "log4js";
import { ARKBot } from "./ARKBot";

configure({
    appenders: {
        debugFile: { type: "file", filename: "logs/debug.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
        errorFile: { type: "file", filename: "logs/error.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
        console: { type: "console", layout: { type: "colored" } },
        errors: { type: "logLevelFilter", appender: "errorFile", level: "error" }
    },
    categories: {
        default: { appenders: ["console", "debugFile", "errors"], level: "debug" }
    }
});
const token = process.env.token
export const Bot = new ARKBot()

async function main() {
    Events.RegisterEvents(Bot)
    await Interactions.LoadCommands(Bot)
    Modules.LoadModules()
    //Login
    await Bot.login(token);
    await Interactions.DeployCommands(Bot)
    Modules.RunModules()
}

main()
