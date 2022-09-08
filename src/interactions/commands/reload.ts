import type { ChatInputCommandInteraction } from "discord.js";
import { BotSlashCommand } from "../../models/index.js";
import Services from "../../services/index.js";
import { Client } from "../index.js";

const Reply: { [index: string]: string } = {
    "ru": "Конфиг перезагружен."
};

class Reload extends BotSlashCommand {
    constructor() {
        super("reload");
        this.isTeamOnly = true;
        this.command.setDescription("Reload config")
            .setDescriptionLocalization("ru", "Перезагрузить конфиг");
    }
    public async execute(i: ChatInputCommandInteraction): Promise<void> {
        await i.deferReply();
        Client.reloadConfig();
        Services.Reload();
        await i.editReply(Reply[i.locale] ?? "Config reloaded.");
    }
}

export default Reload;
