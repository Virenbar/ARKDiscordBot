import type { ChatInputCommandInteraction } from "discord.js";
import ServerStatus from "../../services/serverStatus.js";
import StatusMessage from "../../services/statusMessage.js";
import { BotSlashCommand } from "../index.js";

class Refresh extends BotSlashCommand {
    constructor() {
        super("refresh");
        this.isGlobal = true;
        this.isOwnerOnly = true;
        this.globalCooldown = 60;
        this.command.setDescription("Refresh monitoring")
            .setDescriptionLocalization("ru", "Принудительное обновление мониторинга");
    }
    public async execute(i: ChatInputCommandInteraction): Promise<void> {
        await i.deferReply({ ephemeral: true });
        await ServerStatus.refresh();
        await StatusMessage.forceRefresh();
        await i.editReply("Мониторинг обновлен.");
    }
}

export default Refresh;
