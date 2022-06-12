import { CommandInteraction } from "discord.js";
import { BotSlashCommand } from "../../models/index.js";
import modules from "../../modules/index.js";
import config from "../../config.js";

export default class extends BotSlashCommand {
    constructor() {
        super("reload")
        this.userCooldown = 0
        this.command.setDescription("Reload config")
    }
    public async execute(i: CommandInteraction): Promise<void> {
        await i.deferReply()
        config.loadConfig()
        modules.Reload()
        await i.editReply("Конфигурация обновлена.")
    }
}
