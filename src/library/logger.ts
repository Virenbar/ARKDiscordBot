import { configure, getLogger, Logger, } from "log4js";
//import { Bot } from "..";

export let ARK66Log: Logger;

export function loadLogger(): void {
    configure({
        appenders: {
            debugFile: { type: "file", filename: "logs/debug.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
            errorFile: { type: "file", filename: "logs/error.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
            console: { type: "console", layout: { type: "colored" } },
            errors: { type: 'logLevelFilter', appender: 'errorFile', level: 'error' }
        },
        categories: {
            default: { appenders: ["console", "debugFile", "errors"], level: "debug" }
        }
    });
    ARK66Log = getLogger("ARK66")
}

export default { loadLogger }