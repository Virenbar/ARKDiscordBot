import type { BaseGuildTextChannel, Client } from "discord.js";

/**
 * Create or Delete messages in channel to specified count
 */
export async function prepareMessages(client: Client<true>, channel: BaseGuildTextChannel, count: number) {
    let Messages = await channel.messages.fetch({ limit: 50 });
    Messages = Messages.filter((M) => M.author.id == client.user.id);
    const diff = Messages.size - count;

    if (diff > 0) {
        for (const message of Messages.last(diff)) {
            await message.delete();
            Messages.delete(message.id);
        }
    } else if (diff < 0) {
        for (let i = diff; i < 0; i++) {
            const M = await channel.send("Placeholder");
            Messages.set(M.id, M);
        }
    }
    return Messages.sort().map((V) => V); //.sort((A, B) => A.id.localeCompare(B.id))
}
