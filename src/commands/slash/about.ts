import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { t } from "i18next";
import { formatBytes, getGuildColor } from "../../helpers/index.js";
import meta from "../../helpers/meta.js";
import { IPLookup } from "../../services/ipapi.js";
import { BotSlashCommand } from "../command.js";
import { Client } from "../index.js";

class About extends BotSlashCommand {
    constructor() {
        super("about");
        this.isGlobal = true;
        this.command.setDescription("Information about bot")
            .setDescriptionLocalization("ru", "Получить информацию о боте");
    }

    public async execute(i: ChatInputCommandInteraction): Promise<void> {
        await i.deferReply();
        const user = Client.user;
        const avatar = user.avatarURL({ extension: "png", size: 512 }) ?? user.defaultAvatarURL;
        const ARA = await Client.users.fetch("987367383163371542");

        const ip = await IPLookup();
        const OSM = `[${ip.latitude} ${ip.longitude}](https://www.openstreetmap.org/#map=13/${ip.latitude}/${ip.longitude})`;
        const memory = meta.memory();
        const time = meta.timings();

        let description = "**ARK66** Discord Bot";
        description += `\nBased on codebase of **${ARA}** (Artificial Relay Administrator)`;
        description += "\n";
        description += `\n**Version:** ${meta.version} **Repository:** [Github](${meta.repository})`;
        description += `\n**Location:** ${ip.country_name}, ${ip.city} (${OSM})`;
        description += `\n**Uptime:** ${time.uptime.process.toFormat("d.hh:mm:ss")}`;
        description += `\n**Memory:** ${formatBytes(memory.process)}`;
        description += `\n**ID:** ${user.id}`;

        const Fields = [
            { name: "Events", value: Client.events.size },
            { name: "Commands", value: Client.commands.size }
        ];
        const Embed = new EmbedBuilder()
            .setTitle(t("command.chat.about.title", { lng: i.locale }))
            .setThumbnail(avatar)
            .setDescription(description)
            .setFields(Fields.map(F => ({ name: F.name, value: `${F.value}`, inline: true })))
            .setColor(getGuildColor(i.guild))
            .setFooter({ text: "Made with discord.js", iconURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png" })
            .setTimestamp(i.createdTimestamp);

        await i.editReply({ embeds: [Embed] });
    }
}

export default About;
