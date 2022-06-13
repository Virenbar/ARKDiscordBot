import { Client, TextBasedChannel } from "discord.js";


export async function (client: Client<true>, channel: TextBasedChannel, count: number) {
    const M = await channel.messages.fetch({ limit: 10 })
    const BotMessages = M.filter(M => M.author.id == Bot.user.id)
    const diff = BotMessages.size - count
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