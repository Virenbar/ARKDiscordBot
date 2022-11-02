import { CommandInteraction, EmbedBuilder } from "discord.js";
import { t } from "i18next";
import _ from "lodash";
import { getGuildColor } from "../index.js";

const Images = [
    "https://i.imgur.com/gcYo818.jpg",
    "https://i.imgur.com/JBOk9cE.jpg",
    "https://i.imgur.com/wavCKsZ.jpg",
    "https://i.imgur.com/pfixrER.jpg",
    "https://i.imgur.com/KLo0DXZ.jpg",
    "https://i.imgur.com/2Y1dXom.jpg"
];

export function getSMDEmbed(i: CommandInteraction) {
    const image = _.sample(Images) as string;
    return new EmbedBuilder()
        .setTitle("NSFW Protection")
        .setImage(image)
        .setColor(getGuildColor(i.guild))
        .setFooter({ text: t("command.common.nsfw", { lng: i.locale }) });
}
