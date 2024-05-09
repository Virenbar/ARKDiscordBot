import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { t } from "i18next";
import { createTable, getGuildColor } from "../../helpers/index.js";
import ServerStatus from "../../services/serverStatus.js";
import { BotSlashCommand } from "../command.js";

class Online extends BotSlashCommand {
    constructor() {
        super("online");
        this.isGlobal = true;
        this.command.setDescription("List of players online")
            .setDescriptionLocalization("ru", "Список игроков онлайн");
    }
    public async execute(i: ChatInputCommandInteraction): Promise<void> {
        await i.deferReply();
        const lng = i.locale;

        await ServerStatus.refresh();
        const players = ServerStatus.Players;

        const title = `${t("command.chat.online.title", { lng })}: ${players.length}`;
        let description = t("command.chat.online.no-players", { lng });
        if (players.length) {
            const list = players.map(P => ({
                name: `${P.name}${P.tribe ? ` (${P.tribe})` : ""}`,
                server: P.server
            }));
            description = "```";
            description += createTable(list);
            description += "```";
        }

        const Embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(getGuildColor(i.guild))
            .setTimestamp(i.createdTimestamp);
        await i.editReply({ embeds: [Embed] });
    }
}

export default Online;
