import { Message, MessageEmbed, TextChannel } from "discord.js";
import log4js from "log4js";
import { DateTime } from "luxon";

import { sleep } from "../utils.js";
import { ARKServer, Servers } from "./serverInfo.js";
import { Module, Config } from "../models/index.js";
import { ARKBot } from "../ARKBot.js";

const EmbedsInMessage = 10
const LoopWait = 5 * 60 * 1000
const Logger = log4js.getLogger("Status Message")

let Bot: ARKBot
let Config: Config
let Channel = ""
let Messages: Message[] = []
let MessageCount = 1
//EmbedCount = 1

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
    const ServerCount = Config.servers.length
    //this.EmbedCount = ServerCount + 1
    MessageCount = Math.ceil(ServerCount / EmbedsInMessage) + 1
}

async function Loop() {
    await sleep(10 * 1000)
    for (; ;) {
        try {
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
    const M = await C.messages.fetch({ limit: 50 })
    const BotMessages = M.filter(M => M.author.id == Bot.user.id)
    const diff = BotMessages.size - MessageCount
    if (diff > 0) {
        const D = BotMessages.last(-diff)
        D.forEach(async M => {
            await M.delete()
            BotMessages.delete(M.id)
        })
    } else if (diff < 0) {
        for (let i = diff; i < 0; i++) {
            const M = await C.send("ARK66")
            BotMessages.set(M.id, M)
        }
    }
    Messages = BotMessages.map(V => V).reverse()
}

async function UpdateMessages() {
    let Index = 0
    //First message with all servers
    /*let Status = ""
    let PLayers = ""
    let Links = ""
    for (const S of Servers) {
        Status += `${S.isOnline ? ":green_circle:" : ":red_circle:"} ${S.name}\n`
        PLayers += `👨‍💻${S.players.online}\n`
        Links += `[▶Подключиться](steam://connect/${S.address})\n`
    }*/

    const MaxName = Math.max(...Servers.map(S => S.name.length))
    let D = ""
    for (const S of Servers) {
        D += `${S.isOnline ? ":green_circle:" : ":red_circle:"} **${S.name}** ${S.address}`.padEnd(MaxName)
        D += ` (${S.players.online}/${S.players.max})\n`
        D += ` ▶Подключиться <steam://connect/${S.address}>\n`
    }
    const E = new MessageEmbed()
        .setTitle("Статус серверов")
        .setDescription(D)
        /*.addFields(
            { name: "Сервер", value: Status, inline: true },
            { name: "Игроков", value: PLayers, inline: true },
            { name: "▶", value: Links, inline: true }
        )*/
        .setFooter({ text: "Обновлено" })
        .setTimestamp(Date.now())

    await Messages[Index++].edit({ content: null, embeds: [E] })

    //Other messages with individual servers
    const Embeds: MessageEmbed[] = []
    for (const S of Servers) {
        const E = MakeEmbed(S)
        Embeds.push(E)
        if (Embeds.length == 10) {
            Messages[Index++].edit({ content: null, embeds: Embeds })
            Embeds.length = 0
        }
    }
    if (Embeds.length > 0) { Messages[Index++].edit({ content: null, embeds: Embeds }) }
    Logger.debug("Messages updated")
}

function MakeEmbed(server: ARKServer): MessageEmbed {
    let D = `Карта: ${server.map}`
    if (server.isOnline && server.players.online == 0) { D += "\nНа сервере нет игроков" }
    if (!server.isOnline) { D += "\nСервер отключен" }

    const E = new MessageEmbed()
    E.setTitle(server.name)
    E.setDescription(D)
    if (server.players.online > 0) {
        let Names = ""
        let Times = ""
        for (const P of server.players.list) {
            Names += `${P.Name}\n`
            Times += `${P.Time.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}\n`
        }
        E.addFields(
            { name: "Игрок", value: Names, inline: true },
            { name: "Время игры", value: Times, inline: true }
        )
    }
    E.setFooter({ text: "" })
    E.setTimestamp(Date.now())
    return E
}
const Module: Module = { Initialize, Start, Reload }
export default Module
