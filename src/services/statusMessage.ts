import { ActionRowBuilder, BaseGuildTextChannel, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import _ from "lodash";
import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import { Emojis } from "../constants.js";
import { prepareMessages, sleep } from "../helpers/index.js";
import type { Service } from "./index.js";
import { CheckServers, Servers } from "./serverInfo.js";
import { CheckStatus } from "./serverStatus.js";

const Logger = log4js.getLogger("Status Message");

let Client: ARKBot;
let Channel: BaseGuildTextChannel;
let MessageCount = 1;

function Initialize(client: ARKBot) {
    Client = client;
}

async function Start(): Promise<void> {
    Reload();
    for (; ;) {
        try {
            await CheckServers();
            await CheckStatus();
            await UpdateMessages();

            //await sleep(LoopWait)
        } catch (error) {
            Logger.error("Unknown Error");
            Logger.error(error);
            await sleep(5 * 60 * 1000);
        }
    }
}

async function Reload() {
    Channel = (await Client.channels.fetch(Client.config.channel)) as BaseGuildTextChannel;
    MessageCount = 1;//Math.ceil(Config.servers.length / 5) + 1;
}

function FixName(name: string) {
    return name.replace(/[\u{0080}-\u{03FF}\u{0500}-\u{FFFF}]/gmu, "?").substring(0, 15);
}

export async function UpdateMessages() {

    //Status Message
    const Players = _.flatMap(Servers, (S) => S.players.list);
    const MaxPlayerName = Math.min(Math.max(...Players.map((P) => P.Name.length)), 16);
    const MaxMapName = Math.max(...Servers.map((S) => S.name.length));
    let Status = "";
    for (const S of Servers) {
        Status += `${S.isOnline ? ":green_circle:" : ":red_circle:"} [${S.number}]**${S.name}** `;
        Status += S.battlemetrics ?
            `[(${S.players.online}/${S.players.max})](https://www.battlemetrics.com/servers/ark/${S.battlemetrics})\n` :
            `(${S.players.online}/${S.players.max})\n`;
    }
    if (Players.length > 0) {
        Status += `\n**Список игроков (${Players.length})**\n`;
        Status += "```";
        Status += `${"Игрок".padEnd(MaxPlayerName)} ${"Сервер".padEnd(MaxMapName)} Время игры\n`;
        for (const S of Servers) {
            for (const P of S.players.list) {
                Status += `${FixName(P.Name).padEnd(MaxPlayerName)} ${S.name.padEnd(MaxMapName)} ${P.Time.toFormat("hh:mm:ss")}\n`;
            }
        }
        Status += "```";
    }
    const Embed = new EmbedBuilder()
        .setTitle("Статус серверов")
        .setDescription(Status)
        .setColor(Channel.guild.members.me?.displayColor ?? "Default")
        .setFooter({ text: "Последнее обновление" })
        .setTimestamp(Date.now());

    //Refresh Button
    const Button = new ButtonBuilder()
        .setEmoji("🔄")
        .setLabel("Обновить")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("refresh")
        .setDisabled();

    const Row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(Button);

    /*Charts  
    const Charts: MessageEmbed[] = [];
    for (const H of History) {
        if (!H.playersChart) continue;
        
        const Points: Chart.ChartPoint[] = H.players.data.map(p => ({ x: p.attributes.timestamp, y: p.attributes.max }));
        const QC: QuickChart = new QuickChart()
            .setConfig({
                type: "line",
                data: {
                    datasets: [{
                        data: Points,
                        borderColor: "#199F00",
                        borderWidth: 2
                    }]

                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            type: "time"
                        }]
                    }
                }

            });
        const T = await QC.getShortUrl();

        const Chart = new MessageEmbed()
            .setTitle(`[${H.server.number}]${H.server.name}`)
            .setColor(H.server.isOnline ? CommonColor.Green : CommonColor.Red)
            .setImage(H.playersChart);
        Charts.push(Chart);
    }*/

    //Update messages
    MessageCount = 1;//Math.ceil(Config.servers.length / 10) + 1;
    let Index = 0;
    const Messages = await prepareMessages(Client, Channel, MessageCount);
    const StatusMessage = await Messages[Index++].edit({ content: null, embeds: [Embed], components: [Row] });

    // for (const embeds of _.chunk(Charts, 10)) {
    //     await Messages[Index++].edit({ content: null, embeds: embeds, components: [] });
    // }
    Logger.debug("Messages updated");

    //Cooldown before refresh
    await sleep(60 * 1000);
    Button.setDisabled(false);
    await StatusMessage.edit({ components: [Row] });
    Button.setDisabled()
        .setEmoji(Emojis.RAT_JAM)
        .setLabel("Обновление...");

    //Wait for press or disable after time
    await StatusMessage.awaitMessageComponent({ time: 4 * 60 * 1000 })
        .then((i) => {
            i.update({ components: [Row] });
            Logger.info(`Refresh clicked: ${i.user.username}`);
        })
        .catch(() => StatusMessage.edit({ components: [Row] }));
}

const StatusMessage: Service = { Initialize, Start, Reload };
export default StatusMessage;
