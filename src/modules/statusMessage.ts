import { Message, MessageEmbed, TextChannel } from "discord.js";
import log4js from "log4js";
import _ from "lodash"

import { sleep } from "../utils.js";
import { CheckServers, Servers } from "./serverInfo.js";
import { Module, Config } from "../models/index.js";
import { ARKBot } from "../ARKBot.js";

const LoopWait = 5 * 60 * 1000
const Logger = log4js.getLogger("Status Message")

let Bot: ARKBot
let Config: Config
let Channel = ""
let Messages: Message[] = []
let MessageCount = 1

function Initialize(bot: ARKBot, config: Config) {
    Bot = bot
    Config = config
}

async function Start(): Promise<void> {
    Reload()
    await Loop()
}

function Reload() {
    Channel = Config.channel
    MessageCount = 1
}

async function Loop() {
    await sleep(20 * 1000)
    for (; ;) {
        try {
            await CheckServers()
            await PrepareMessages()
            await UpdateMessages()
            await sleep(LoopWait)
        } catch (error) {
            Logger.error("Unknown Error")
            Logger.error(error)
            await sleep(LoopWait)
        }
    }
}

async function PrepareMessages() {
    const C = await Bot.channels.fetch(Channel) as TextChannel
    const M = await C.messages.fetch({ limit: 10 })
    const BotMessages = M.filter(M => M.author.id == Bot.user.id)
    const diff = BotMessages.size - MessageCount
    if (diff > 0) {
        const D = BotMessages.last(diff)
        D.forEach(async M => {
            await M.delete()
            BotMessages.delete(M.id)
        })
    } else if (diff < 0) {
        for (let i = diff; i < 0; i++) {
            const M = await C.send("ARKBot")
            BotMessages.set(M.id, M)
        }
    }
    Messages = BotMessages.map(V => V).reverse()
}

export async function UpdateMessages() {
    let Index = 0

    const Players = _.flatMap(Servers, S => S.players.list)
    const MaxPlayerName = Math.max(...Players.map(P => P.Name.length))
    const MaxMapName = Math.max(...Servers.map(S => S.name.length))
    let ServerNumber = 1
    let D = ""
    for (const S of Servers) {
        D += `${S.isOnline ? ":green_circle:" : ":red_circle:"} [${ServerNumber++}]**${S.name}**`
        D += ` (${S.players.online}/${S.players.max})\n`
    }
    if (Players.length == 0) {
        D += ""
    } else {
        D += `\n**Список игроков (${Players.length})**\n`
        D += "```"
        D += `${"Игрок".padEnd(MaxPlayerName)} ${"Сервер".padEnd(MaxMapName)} Время игры\n`
        for (const S of Servers) {
            for (const P of S.players.list) {
                D += `${P.Name.padEnd(MaxPlayerName)} ${S.name.padEnd(MaxMapName)} ${P.Time.toFormat("hh:mm:ss")}\n`
            }
        }
        D += "```"
    }
    const E = new MessageEmbed()
        .setTitle("Статус серверов")
        .setDescription(D)
        .setFooter({ text: "Обновлено" })
        .setTimestamp(Date.now())

    await Messages[Index++].edit({ content: null, embeds: [E] })
    Logger.debug("Messages updated")
}

const Module: Module = { Initialize, Start, Reload }
export default Module
