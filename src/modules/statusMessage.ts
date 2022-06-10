import { Message, MessageEmbed, TextChannel } from "discord.js";
import { DateTime } from "luxon";

import { Module } from "./module";
import { sleep } from "../utils";
import { ARKServer, serverInfo } from "./serverInfo";

const EmbedsInMessage = 10
const LoopWait = 5 * 60 * 1000

export class StatusMessage extends Module {
    constructor() {
        super("Status Message")
    }

    Channel = ""
    Messages: Message[] = []
    MessageCount = 1
    //EmbedCount = 1

    public Reload() {
        this.Channel = this.bot.config.channel
        const ServerCount = this.bot.config.servers.size
        //this.EmbedCount = ServerCount + 1
        this.MessageCount = Math.floor(ServerCount / EmbedsInMessage) + 1
    }

    public async Start(): Promise<void> {
        this.Reload()
        await this.Loop()
    }

    async Loop() {
        for (; ;) {
            try {
                await this.PrepareMessages()
                await this.UpdateMessages()
                await sleep(LoopWait)
            } catch (error) {
                this.logger.error("Unknown Error")
                this.logger.error(error)
                await sleep(LoopWait)
            }
        }
    }

    async PrepareMessages() {
        const C = await this.bot.channels.fetch(this.Channel) as TextChannel
        const M = await C.messages.fetch({ limit: 50 })
        const BotMessages = M.filter(M => M.author.id == this.bot.user.id)

        const diff = BotMessages.size - this.MessageCount
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
        this.Messages = BotMessages.map(V => V)
    }

    async UpdateMessages() {
        let Index = 0
        const Servers = serverInfo.Servers
        //First message with all servers
        let D = ""
        for (const S of Servers) {
            D += `${S.isOnline ? ":green_circle:" : ":red_circle:"} ${S.name} ${S.address} \n`
            D += `Карта: ${S.map} Игроков: ${S.players.online}`
        }
        const F = new MessageEmbed()
            .setTitle("Статус серверов")
            .setDescription(D)
            .setFooter({ text: "Обновлено" })
            .setTimestamp(Date.now())

        this.Messages[Index++].edit({ embeds: [F] })

        //Other messages with individual servers
        const Embeds: MessageEmbed[] = []
        for (const S of Servers) {
            const E = this.MakeEmbed(S)
            Embeds.push(E)
            if (Embeds.length == 10) {
                this.Messages[Index++].edit({ embeds: Embeds })
                Embeds.length = 0
            }
        }
        if (Embeds.length > 0) { this.Messages[Index++].edit({ embeds: Embeds }) }
    }

    MakeEmbed(server: ARKServer): MessageEmbed {
        const E = new MessageEmbed()
            .setDescription(server.name)
        if (server.players.online == 0) {
            E.addFields({ name: "На сервере нет игроков", value: "" })
        } else {
            let Names = ""
            let Times = ""
            for (const P of server.players.list) {
                Names += `${P.Name}\n`
                Times += `${P.Time.toLocaleString(DateTime.TIME_24_WITH_SECONDS)}\n`
            }
            E.addFields({ name: "Игрок", value: Names }, { name: "Время игры", value: Times })
        }
        E.setFooter({ text: "" })
        E.setTimestamp(Date.now())
        return E
    }
}

export const statusMessage = new StatusMessage()
