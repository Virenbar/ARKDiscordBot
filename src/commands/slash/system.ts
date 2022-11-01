import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { t } from "i18next";
import { formatBytes, getGuildColor } from "../../helpers/index.js";
import meta from "../../helpers/meta.js";
import { BotSlashCommand } from "../command.js";

class System extends BotSlashCommand {
    constructor() {
        super("system");
        this.globalCooldown = 10;
        this.isGlobal = true;
        this.command.setDescription("Information about system")
            .setDescriptionLocalization("ru", "Получить информацию о системе");
    }

    public async execute(i: ChatInputCommandInteraction): Promise<void> {
        await i.deferReply();
        const time = meta.timings();
        const mem = meta.memory();

        let description = `**OS**: ${meta.OS}`;
        description += `\n**OS boot:** ${time.boot.toFormat("GG yyyy.LL.dd hh:mm")}`;
        description += `\n**CPU:** ${meta.CPU}`;
        description += `\n**Memory:** ${formatBytes(mem.used)} (${formatBytes(mem.total)})`;
        description += `\n**OS Uptime:** ${time.uptime.system.toFormat("d.hh:mm:ss")}`;
        description += `\n**Bot Uptime:** ${time.uptime.process.toFormat("d.hh:mm:ss")}`;

        const title = t("command.chat.system.title", { lng: i.locale });

        const Embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(getGuildColor(i.guild));

        await i.editReply({ embeds: [Embed] });
    }
}

export default System;
