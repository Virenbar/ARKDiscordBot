import type { Message } from "discord.js";
import { BotEmojis } from "../constants.js";
import { sleep } from "../helpers/index.js";
import type { EventHandler } from "./index.js";
import { Client } from "./index.js";

const event: EventHandler<"messageCreate"> = {
    event: "messageCreate",
    async execute(message: Message): Promise<void> {
        if (message.author.id == Client.user.id) { return; }
        if (message.mentions.has(Client.user)) {
            await ReplyToPing(message);
        }
    }
};

export default event;

async function ReplyToPing(message: Message) {
    await sleep(2 * 1000);
    const M = await message.reply({ content: "https://cdn.discordapp.com/attachments/870401058948677702/985358192282316830/loona_judging.gif" });
    await sleep(10 * 1000);
    await M.delete();
    await message.react(BotEmojis.Local.ratDance);
}
