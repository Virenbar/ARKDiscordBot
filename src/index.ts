import { Client, Intents } from "discord.js"
//import { Logger } from "log4js"
//import dotenv from "dotenv"
//dotenv.config()

import { loadLogger, ARK66Log } from "./library/logger"
import { ARK66Config, loadConfig } from './config'
//export { State, saveState } from './lib/state'
//import { loadState } from './lib/state'

//import Interactions from './interactions';
//import Modules from './modules'
import Events from "./events"
import { Logger } from "log4js";


const myIntents = new Intents();
myIntents.add(
    'GUILD_INTEGRATIONS',
    'GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS',
    'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS');

export const Bot = new Client({ intents: myIntents }) as ARK66Bot

loadLogger()
loadConfig()

//Interactions.Load(Bot)
Events.RegisterEvents(Bot)
//Modules.LoadModules(Bot)


//Login
const token = process.env.token
Bot.logger = ARK66Log;
Bot.login(token);

export interface ARK66Bot extends Client<true> {
    /** Основные настройки
     * @type {IConfig}
     * @memberof DClient
     */
    "config": ARK66Config,
    "logger": Logger
}