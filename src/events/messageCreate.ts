import type { Message } from "discord.js";
import type { EventHandler } from "./index.js";
import { Client } from "../index.js";
import { sleep } from "../helpers/index.js";
import { Emojis } from "../constants.js";

const event: EventHandler<"messageCreate"> = {
    name: "Message Create",
    event: "messageCreate",
    async execute(message: Message): Promise<void> {
        if (message.mentions.has(Client.user)) { await ReplyToPing(message); }
    }
};

export default event;

async function ReplyToPing(message: Message) {
    await sleep(2 * 1000);
    const M = await message.reply({ content: "https://cdn.discordapp.com/attachments/870401058948677702/985358192282316830/loona_judging.gif" });
    await sleep(10 * 1000);
    await M.delete();
    await message.react(Emojis.RAT_JAM);
}
