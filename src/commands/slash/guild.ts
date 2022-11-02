import { ChatInputCommandInteraction, EmbedBuilder, time } from "discord.js";
import { t } from "i18next";
import { getGuildColor } from "../../helpers/index.js";
import { BotSlashCommand } from "../command.js";

class Guild extends BotSlashCommand {
    constructor() {
        super("guild");
        this.command.setDescription("Information about server")
            .setDescriptionLocalization("ru", "Информация о сервере");
    }
    public async execute(i: ChatInputCommandInteraction): Promise<void> {
        await i.deferReply();
        const lng = i.locale;
        if (!i.guild) {
            await i.reply(t("common.error.DM", { lng }) as string);
            return;
        }
        const guild = i.guild;
        await guild.fetch();

        const title = `${t("command.chat.guild.title", { lng })}: ${guild.name} (${guild.nameAcronym})`;
        const icon = guild.iconURL({ size: 512, extension: "png" });

        let description = `🔹 **${t("label.created", { lng })}**: ${time(guild.createdAt, "R")}`;
        description += `\n🔹 **${t("label.members", { lng })}**: ${guild.memberCount}`;
        description += `\n🔹 **${t("label.roles", { lng })}**: ${guild.roles.cache.size}`;

        const Embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setThumbnail(icon)
            .setColor(getGuildColor(i.guild))
            .setFooter({ text: `ID: ${guild.id}` })
            .setTimestamp(i.createdTimestamp);
        await i.editReply({ embeds: [Embed] });
    }
}

export default Guild;
