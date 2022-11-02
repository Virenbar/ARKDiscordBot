import type { ChatInputCommandInteraction } from "discord.js";
import { t } from "i18next";
import { DateTime } from "luxon";
import crypto from "node:crypto";
import { BotSlashCommand } from "../command.js";

const min = 50;
const max = 250;

export default class Pong extends BotSlashCommand {
    constructor() {
        super("pong");
        this.userCooldown = 0;
        this.isGlobal = true;
        this.command.setDescription("Pong!")
            .setDescriptionLocalization("ru", "Понг!");
    }

    public async execute(i: ChatInputCommandInteraction): Promise<void> {
        const Seed = `${i.user.id}:${DateTime.now().toISODate()}`;
        const Hash = crypto.createHash("sha256").update(Seed).digest("hex");
        const IQ = Math.floor(parseInt(Hash, 16) / Math.pow(16, Hash.length) * (max - min + 1)) + min;
        const message = t("command.chat.pong.reply", { lng: i.locale, IQ });
        await i.reply(message);
    }
}
