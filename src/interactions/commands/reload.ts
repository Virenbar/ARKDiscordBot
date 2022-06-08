import { CommandInteraction } from "discord.js";
import { ICommand } from "..";

const command: ICommand = {
    name: "reload",
    description: "Reload config",
    cooldown: 5,
    async execute(i: CommandInteraction): Promise<void> {
        await i.reply("Reloading.")
    }
}

export = command