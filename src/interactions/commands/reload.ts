import { PermissionFlagsBits } from "discord-api-types/v10";
import type { CommandInteraction } from "discord.js";
import config from "../../config";
import { BotSlashCommand } from "../../models";
import services from "../../services";

const Reply: { [index: string]: string } = {
    "ru": "Конфиг обновлен."
};
export default class extends BotSlashCommand {
    constructor() {
        super("reload");
        this.userCooldown = 0;
        this.command.setDescription("Reload config")
            .setDescriptionLocalization("ru", "Перезагрузить конфиг")
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    }
    public async execute(i: CommandInteraction): Promise<void> {
        await i.deferReply();
        config.loadConfig();
        services.Reload();
        await i.editReply(Reply[i.locale] ?? "Config reloaded.");
    }
}
