import type { CommandInteraction } from "discord.js";
import { BotSlashCommand } from "../../models";

class Ping extends BotSlashCommand {
    constructor() {
        super("ping");
        this.userCooldown = 0;
        this.command.setDescription("Ping!");
        this.isGlobal = true;
    }

    public async execute(i: CommandInteraction): Promise<void> {
        return i.reply("Pong.");
    }
}

export default Ping;
