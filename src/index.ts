import "dotenv"

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

export const Bot = new ARKBot()

Interactions.Load(Bot)
Events.RegisterEvents(Bot)
Modules.LoadModules(Bot)


//Login
const token = process.env.token
Bot.login(token);