import type { ChatInputCommandInteraction } from "discord.js";
import { t } from "i18next";
import { BotSlashCommand } from "../command.js";
import { Client } from "../index.js";

export default class Ping extends BotSlashCommand {
    constructor() {
        super("ping");
        this.userCooldown = 0;
        this.isGlobal = true;
        this.command.setDescription("Ping!")
            .setDescriptionLocalization("ru", "Пинг!");
    }

    public async execute(i: ChatInputCommandInteraction): Promise<void> {
        const ping = Client.ws.ping;
        const message = t("command.chat.ping.reply", { lng: i.locale, ping });
        await i.reply(message);
    }
}
