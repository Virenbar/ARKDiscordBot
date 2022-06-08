import { CommandInteraction } from "discord.js";
import { ICommand } from "..";

const command: ICommand = {
    name: "ping",
    description: "Ping!",
    cooldown: 5,
    async execute(i: CommandInteraction): Promise<void> {
        await i.reply("Pong.")
    }
}

export = command