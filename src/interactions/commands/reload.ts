import { CommandInteraction } from "discord.js";
import { BotSlashCommand } from "../../models";

class Ping extends BotSlashCommand {
    constructor() {
        super("reload")
        this.userCooldown = 0
        this.command.setDescription("Reload config")
    }
    public async execute(i: CommandInteraction): Promise<void> {
        return i.reply("Reloading.")
    }
}

export = Ping
