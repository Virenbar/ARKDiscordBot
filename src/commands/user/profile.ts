import { ContextMenuCommandInteraction, EmbedBuilder, time } from "discord.js";
import { t } from "i18next";
import { Duration } from "luxon";
import { BotEmojis } from "../../constants.js";
import { getGuildColor, sleepS } from "../../helpers/index.js";
import { BotUserMenuCommand } from "../command.js";
import { Client } from "../index.js";

class Profile extends BotUserMenuCommand {
    constructor() {
        super("Profile");
        this.command
            .setNameLocalization("ru", "Профиль");
    }
    public async execute(i: ContextMenuCommandInteraction): Promise<void> {
        await i.deferReply({ ephemeral: true });
        if (!i.guild) { throw new Error("Guild is null"); }
        const lng = i.locale;

        const member = await i.guild.members.fetch(i.targetId);
        const user = member.user;
        const created = user.createdAt;
        const joined = member.joinedAt;
        const premium = member.premiumSince;
        const avatar = member.avatarURL({ extension: "png", size: 512 }) ?? user.avatarURL({ extension: "png", size: 512 }) ?? user.defaultAvatarURL;
        const count = Math.floor(Duration.fromMillis(Date.now() - created.getTime()).as("days"));

        let description = `🔹 **${t("label.user", { lng })}**: ${user}`;
        description += `\n🔹 **${t("label.created", { lng })}**: ${time(created, "R")}`;
        if (joined) {
            description += `\n🔹 **${t("label.joined", { lng })}**: ${time(joined, "R")}`;
        }
        if (premium) {
            description += `\n🔹 **${t("label.premium", { lng })}**: ${time(premium, "R")}`;
        }
        description += `\n🔹 **${t("label.age", { lng })}**: ${t("plural.day", { lng, count })}`;

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `${member.displayName}(${user.tag})`, iconURL: user.displayAvatarURL() })
            .setDescription(description)
            .setThumbnail(avatar)
            .setColor(getGuildColor(i.guild))
            .setFooter({ text: `ID: ${user.id}` })
            .setTimestamp(i.createdTimestamp);

        await i.editReply({ embeds: [Embed] });
        if (i.targetId == Client.user.id) {
            await sleepS(2);
            await i.editReply({ content: `${BotEmojis.External.FA_FoxetteShy}` });
        }
    }
}

export default Profile;
