import { Message } from "discord.js";
import { EventHandler } from "./index.js";
import { Bot } from "../index.js";

const event: EventHandler<"messageCreate"> = {
    name: "Client Ready",
    event: "messageCreate",
    async execute(message: Message): Promise<void> {
        if (message.mentions.has(Bot.user)) {
            message.reply({ content: "**Не пингуй меня!**", files: ["https://cdn.discordapp.com/attachments/870401058948677702/985358192282316830/loona_judging.gif"] })
        }

    }
}

export default event
