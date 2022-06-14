import { MessageActionRow, MessageButton, MessageEmbed, TextBasedChannel } from "discord.js";
import log4js from "log4js";
import _ from "lodash"

import { sleep } from "../utils.js";
import { CheckServers, Servers } from "./serverInfo.js";
import { Module, Config } from "../models/index.js";
import { ARKBot } from "../ARKBot.js";
import { prepareMessages } from "../helpers/messageHelper.js";

const LoopWait = 5 * 60 * 1000
const Logger = log4js.getLogger("Status Message")

let Bot: ARKBot
let Config: Config
let Channel: TextBasedChannel
let MessageCount = 1

function Initialize(bot: ARKBot, config: Config) {
    Bot = bot
    Config = config
}

async function Start(): Promise<void> {
    Reload()
    await Loop()
}

async function Reload() {
    Channel = await Bot.channels.fetch(Config.channel) as TextBasedChannel
    MessageCount = 1
}

async function Loop() {
    for (; ;) {
        try {
            await CheckServers()
            await UpdateMessages()
            //await sleep(LoopWait)
        } catch (error) {
            Logger.error("Unknown Error")
            Logger.error(error)
            await sleep(LoopWait)
        }
    }
}

export async function UpdateMessages() {
    const Messages = await prepareMessages(Bot, Channel, MessageCount)
    let Index = 0
    let ServerNumber = 1

    const Players = _.flatMap(Servers, S => S.players.list)
    const MaxPlayerName = Math.max(...Players.map(P => P.Name.length))
    const MaxMapName = Math.max(...Servers.map(S => S.name.length))
    let Status = ""
    for (const S of Servers) {
        Status += `${S.isOnline ? ":green_circle:" : ":red_circle:"} [${ServerNumber++}]**${S.name}**`
        Status += ` (${S.players.online}/${S.players.max})\n`
    }
    if (Players.length > 0) {
        Status += `\n**Список игроков (${Players.length})**\n`
        Status += "```"
        Status += `${"Игрок".padEnd(MaxPlayerName)} ${"Сервер".padEnd(MaxMapName)} Время игры\n`
        for (const S of Servers) {
            for (const P of S.players.list) {
                Status += `${P.Name.padEnd(MaxPlayerName)} ${S.name.padEnd(MaxMapName)} ${P.Time.toFormat("hh:mm:ss")}\n`
            }
        }
        Status += "```"
    }
    const Embed = new MessageEmbed()
        .setTitle("Статус серверов")
        .setDescription(Status)
        //.setFooter({ text: "Обновлено" })
        .setTimestamp(Date.now())
    const M1 = await Messages[Index++].edit({ content: null, embeds: [Embed] })
    Logger.debug("Messages updated")

    await sleep(60 * 1000)
    //Add button for refresh
    const Button = new MessageButton()
        .setLabel("Обновить")
        .setStyle("SUCCESS")
        .setCustomId("refresh")
    const Row = new MessageActionRow(Button)
    await M1.edit({ components: [Row] })
    //Wait for press or delete after time
    await M1.awaitMessageComponent({ filter: i => { i.deferUpdate(); return true }, time: LoopWait }).then(i => {
        Button.setDisabled()
        i.update({ components: [Row] })
    }).catch(i => {
        i.update({ components: [] })
    })
}

const Module: Module = { Initialize, Start, Reload }
export default Module
