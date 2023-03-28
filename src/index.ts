import { Backend } from "@skyra/i18next-backend";
import "dotenv/config";
import i18next, { t } from "i18next";
import log4js from "log4js";
import os from "os";
import { ARKBot } from "./ARKBot.js";

const DEBUG = process.env["DEBUG"];
log4js.configure({
    appenders: {
        fileDebug: { type: "file", filename: "logs/debug.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
        fileError: { type: "file", filename: "logs/error.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
        console: { type: "console", layout: { type: "colored" } },
        infoConsole: { type: "logLevelFilter", appender: "console", level: "info" },
        errorFile: { type: "logLevelFilter", appender: "fileError", level: "error" }
    },
    categories: {
        default: { appenders: ["fileDebug", "errorFile", DEBUG ? "console" : "infoConsole"], level: "debug" }
    }
});
await i18next.use(Backend).init({
    backend: {
        paths: [new URL("./locales/{{lng}}/{{ns}}.json", import.meta.url)]
    },
    preload: ["en", "ru"],
    supportedLngs: ["en", "ru"],
    fallbackLng: "en",
    returnNull: false
});

const token = process.env["token"] as string;
export const Client = new ARKBot(token);
Client.logger.info(t("common.hello", { name: os.platform }));

// Initialization
await Client.initialize();
Client.reload();

// Login
await Client.login();
Client.start();
