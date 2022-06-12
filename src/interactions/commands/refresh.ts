import { CommandInteraction } from "discord.js";
import { BotSlashCommand } from "../../models/index.js";
import { UpdateMessages } from "../../modules/statusMessage.js";
import { CheckServers } from "../../modules/serverInfo.js";

export default class extends BotSlashCommand {
    constructor() {
        super("refresh")
        this.globalCooldown = 60
        this.command.setDescription("Принудительное обновление мониторинга")
    }
    public async execute(i: CommandInteraction): Promise<void> {
        await i.deferReply({ ephemeral: true })
        await CheckServers()
        await UpdateMessages()
        await i.editReply("Мониторинг обновлен.")
    }
}
