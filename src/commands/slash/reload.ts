import type { ChatInputCommandInteraction } from "discord.js";
import { t } from "i18next";
import { BotSlashCommand } from "../command.js";
import { Client } from "../index.js";

class Reload extends BotSlashCommand {
    constructor() {
        super("reload");
        this.isGlobal = true;
        this.isOwnerOnly = true;
        this.command.setDescription("Reload config")
            .setDescriptionLocalization("ru", "Перезагрузить конфиг");
    }
    public async execute(i: ChatInputCommandInteraction): Promise<void> {
        await i.deferReply();
        Client.reload();
        const message = t("command.chat.reload.reply");
        await i.editReply(message);
    }
}

export default Reload;
