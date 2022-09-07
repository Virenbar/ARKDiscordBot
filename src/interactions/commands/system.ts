import { CacheType, CommandInteraction, EmbedBuilder } from "discord.js";
import { DateTime, Duration } from "luxon";
import os from "os";
import { CommonColor } from "../../constants.js";
import { formatBytes } from "../../helpers/index.js";
import { BotSlashCommand } from "../../models/index.js";

const Title: { [index: string]: string } = {
    "ru": "Информация о системе"
};

class System extends BotSlashCommand {
    constructor() {
        super("system");
        this.globalCooldown = 10;
        this.isGlobal = true;
        this.command.setDescription("Information about system")
            .setDescriptionLocalization("ru", "Получить информацию о системе");
    }

    public async execute(i: CommandInteraction<CacheType>): Promise<void> {
        await i.deferReply();
        const pUptime = Duration.fromMillis(process.uptime() * 1000);
        const osUptime = Duration.fromMillis(os.uptime() * 1000);
        const startDate = DateTime.local().minus(osUptime);
        const cpu = os.cpus();

        const memFull = os.totalmem();
        const memFree = os.freemem();
        const memUsed = memFull - memFree;
        let description = `**OS**: ${os.version()}(${os.release()})\n`;
        description += `**OS boot:** ${startDate.toFormat("GG yyyy.LL.dd hh:mm")}\n`;
        description += `**CPU:** ${cpu[0].model} ${cpu.length}x${cpu[0].speed} MHz\n`;
        description += `**Memory:** ${formatBytes(memUsed)} (${formatBytes(memFull)})\n`;
        description += `**OS Uptime:** ${osUptime.toFormat("d.hh:mm:ss")}\n`;
        description += `**Bot Uptime:** ${pUptime.toFormat("d.hh:mm:ss")}`;

        const Embed = new EmbedBuilder()
            .setTitle(Title[i.locale] ?? "System information")
            .setDescription(description)
            .setColor(i.guild?.members?.me?.displayColor ?? CommonColor.Primary);

        await i.editReply({ embeds: [Embed] });
    }
}

export default System;
