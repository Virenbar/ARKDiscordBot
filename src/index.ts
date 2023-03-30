import { Backend } from "@skyra/i18next-backend";
import "dotenv/config";
import i18next, { t } from "i18next";
import log4js from "log4js";
import os from "os";
import { ARKBot } from "./ARKBot.js";

const DEBUG = process.env["DEBUG"];
log4js.configure({
    appenders: {
        console: { type: "console", layout: { type: "colored" } },
        fileInfo: { type: "file", filename: "logs/info.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
        fileError: { type: "file", filename: "logs/error.log", maxLogSize: 1024 * 1024 * 10, backups: 5, compress: true },
        infoFile: { type: "logLevelFilter", appender: "fileError", level: "info" },
        errorFile: { type: "logLevelFilter", appender: "fileError", level: "error" }
    },
    categories: {
        default: { appenders: ["infoFile", "errorFile", "console"], level: DEBUG ? "debug" : "info" }
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
Client.start();
