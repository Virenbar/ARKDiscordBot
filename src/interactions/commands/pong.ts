import type { CommandInteraction } from "discord.js";
import { DateTime } from "luxon";
import { BotSlashCommand } from "../../models/index.js";
import crypto from "node:crypto";
import util from "node:util";

const min = 50;
const max = 250;
const Reply: { [index: string]: string } = {
    "ru": "Пинг. Ваш IQ сегодня: %s"
};

class Pong extends BotSlashCommand {
    constructor() {
        super("pong");
        this.userCooldown = 0;
        this.isGlobal = true;
        this.command.setDescription("Pong!")
            .setDescriptionLocalization("ru", "Понг!");
    }

    public async execute(i: CommandInteraction): Promise<void> {
        const Seed = `${i.user.id}:${DateTime.now().toISODate()}`;
        const Hash = crypto.createHash("sha256").update(Seed).digest("hex");
        const IQ = Math.floor(parseInt(Hash, 16) / Math.pow(16, Hash.length) * (max - min + 1)) + min;
        const message = util.format(Reply[i.locale] ?? "Ping. Your IQ today: %s", IQ);
        await i.reply(message);
    }
}

export default Pong;
