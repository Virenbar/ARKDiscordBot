import type { CommandInteraction } from "discord.js";
import { BotSlashCommand } from "../../models/index.js";

const Reply: { [index: string]: string } = {
    "ru": "Понг."
};

class Ping extends BotSlashCommand {
    constructor() {
        super("ping");
        this.userCooldown = 0;
        this.isGlobal = true;
        this.command.setDescription("Ping!")
            .setDescriptionLocalization("ru", "Пинг!");
    }

    public async execute(i: CommandInteraction): Promise<void> {
        await i.reply(Reply[i.locale] ?? "Pong.");
    }
}

export default Ping;
