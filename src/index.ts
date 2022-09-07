import "dotenv/config";
import log4js from "log4js";

import { ARKBot } from "./ARKBot.js";
import Events from "./events/index.js";
import Interactions from "./interactions/index.js";
import Services from "./services/index.js";

// Logger
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

// Pre-Login
export const Client = new ARKBot();
Client.reloadConfig();
Events.Initialize(Client);
Services.Initialize(Client);
await Interactions.Initialize(Client);

// Login
const token = process.env["token"];
await Client.login(token);
await Interactions.DeployCommands();
Services.Start();
