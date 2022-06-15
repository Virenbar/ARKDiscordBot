import { Message } from "discord.js";
import { EventHandler } from "./index.js";
import { Bot } from "../index.js";
import { sleep } from "../utils.js";
import { Emojis } from "../consts.js";

const event: EventHandler<"messageCreate"> = {
    name: "Client Ready",
    event: "messageCreate",
    async execute(message: Message): Promise<void> {
        if (message.mentions.has(Bot.user)) {
            await sleep(2 * 1000);
            await message.react(Emojis.WHAT_PING);
            const M = await message.reply({ files: ["https://cdn.discordapp.com/attachments/870401058948677702/985358192282316830/loona_judging.gif"] });
            await sleep(10 * 1000);
            await M.delete();
        }
    }
};

export default event;
