import log4js from "log4js";
import "dotenv/config";

import Interactions from "./interactions";
import Modules from "./services";
import Events from "./events";
import { ARKBot } from "./ARKBot";
import config from "./config";

log4js.configure({
    appenders: {
        debugFile: { type: "file", filename: "logs/debug.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
        errorFile: { type: "file", filename: "logs/error.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
        console: { type: "console", layout: { type: "colored" } },
        info: { type: "logLevelFilter", appender: "console", level: "info" },
        errors: { type: "logLevelFilter", appender: "errorFile", level: "error" },
    },
    categories: {
        default: { appenders: ["debugFile", "info", "errors"], level: "debug" },
    },
});

export const Bot = new ARKBot();

config.loadConfig();
Events.RegisterEvents(Bot);
await Interactions.LoadCommands(Bot);
Modules.Initialize(Bot, config.Config);

//Login
const token = process.env["token"];
await Bot.login(token);
await Interactions.DeployCommands(Bot);
Modules.Start();
