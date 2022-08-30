import { PermissionFlagsBits } from "discord-api-types/v10";
import type { CommandInteraction } from "discord.js";
import { BotSlashCommand } from "../../models";
import { CheckServers } from "../../services/serverInfo";
import { CheckStatus } from "../../services/serverStatus";
import { UpdateMessages } from "../../services/statusMessage";

export default class extends BotSlashCommand {
    constructor() {
        super("refresh");
        this.globalCooldown = 60;
        this.command.setDescription("Refresh monitoring")
            .setDescriptionLocalization("ru", "Принудительное обновление мониторинга")
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    }
    public async execute(i: CommandInteraction): Promise<void> {
        await i.deferReply({ ephemeral: true });
        await CheckServers();
        await CheckStatus();
        await UpdateMessages();
        await i.editReply("Мониторинг обновлен.");
    }
}
