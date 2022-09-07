import { PermissionFlagsBits } from "discord-api-types/v10";
import type { ChatInputCommandInteraction } from "discord.js";
import { BotSlashCommand } from "../../models/index.js";
import { CheckServers } from "../../services/serverInfo.js";
import { CheckStatus } from "../../services/serverStatus.js";
import { UpdateMessages } from "../../services/statusMessage.js";

class Refresh extends BotSlashCommand {
    constructor() {
        super("refresh");
        this.globalCooldown = 60;
        this.command.setDescription("Refresh monitoring")
            .setDescriptionLocalization("ru", "Принудительное обновление мониторинга")
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    }
    public async execute(i: ChatInputCommandInteraction): Promise<void> {
        await i.deferReply({ ephemeral: true });
        await CheckServers();
        await CheckStatus();
        await UpdateMessages();
        await i.editReply("Мониторинг обновлен.");
    }
}

export default Refresh;
