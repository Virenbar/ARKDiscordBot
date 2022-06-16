import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";
import { DateTime, Duration } from "luxon";
import os from "os";

import { formatBytes } from "../../utils.js";
import { BotSlashCommand } from "../../models/command.js";

export default class extends BotSlashCommand {
    constructor() {
        super("system");
        this.command.setDescription("Получить информацию о системе");
        this.globalCooldown = 10;
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
        description += `**OS last restart:** ${startDate.toFormat("GG yyyy.LL.dd hh:mm")}\n`;
        description += `**CPU:** ${cpu[0].model} ${cpu.length}x${cpu[0].speed} MHz\n`;
        description += `**Memory:** ${formatBytes(memUsed)} ${formatBytes(memFull)}\n`;
        description += `**OS Uptime:** ${osUptime.toFormat("d.hh:mm:ss")}\n`;
        description += `**Bot Uptime:** ${pUptime.toFormat("d.hh:mm:ss")}`;

        const Embed = new MessageEmbed()
            .setTitle("Информация о системе")
            .setDescription(description)
            //.addField("OS Uptime", osUptime.toFormat("d.hh:mm:ss"), true)
            //.addField("Bot Uptime", pUptime.toFormat("d.hh:mm:ss"), true)
            .setColor(0x1F043D);

        await i.editReply({ embeds: [Embed] });
    }
}
