import { PermissionFlagsBits } from "discord-api-types/v10";
import type { ChatInputCommandInteraction } from "discord.js";

import { Client } from "../index.js";
import { BotSlashCommand } from "../../models/index.js";
import Services from "../../services/index.js";

const Reply: { [index: string]: string } = {
    "ru": "Конфиг перезагружен."
};

class Reload extends BotSlashCommand {
    constructor() {
        super("reload");
        this.userCooldown = 0;
        this.command.setDescription("Reload config")
            .setDescriptionLocalization("ru", "Перезагрузить конфиг")
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    }
    public async execute(i: ChatInputCommandInteraction): Promise<void> {
        await i.deferReply();
        Client.reloadConfig();
        Services.Reload();
        await i.editReply(Reply[i.locale] ?? "Config reloaded.");
    }
}

export default Reload;
