import { CommandInteraction } from "discord.js";
import { BotSlashCommand } from "../../models/index.js";

class Ping extends BotSlashCommand {
    constructor() {
        super("ping");
        this.userCooldown = 0;
        this.command.setDescription("Ping!");
    }

    public async execute(i: CommandInteraction): Promise<void> {
        return i.reply("Pong.");
    }
}

export default Ping;
