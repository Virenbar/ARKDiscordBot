import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder
} from "discord.js";
import _ from "lodash";
import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import { BotColors, BotEmojis } from "../constants.js";
import { fixName, getGuildColor, prepareMessages, sleepS } from "../helpers/index.js";
import type { Service } from "./index.js";
import { History } from "./serverHistory.js";
import { Servers } from "./serverInfo.js";

const Logger = log4js.getLogger("Status Message");
let Client: ARKBot;
let MessageCount = 1;
let ShowCharts = false;

function initialize(client: ARKBot) {
    Client = client;
}
function reload() {
    ShowCharts = Client.config.showCharts;
}
async function updateMessages() {
    const Channel = await Client.getStatusChannel();

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
                Status += `${fixName(P.Name).padEnd(MaxPlayerName)} ${S.name.padEnd(MaxMapName)} ${P.Time.toFormat("hh:mm:ss")}\n`;
            }
        }
        Status += "```";
    }
    const Embed = new EmbedBuilder()
        .setTitle("Статус серверов")
        .setDescription(Status)
        .setColor(getGuildColor(Channel.guild))
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

    //Update messages
    MessageCount = ShowCharts ? Math.ceil(Servers.length / 10) + 1 : 1;
    let Index = 0;
    const Messages = await prepareMessages(Client, Channel, MessageCount);
    const StatusMessage = await Messages[Index++].edit({ content: null, embeds: [Embed], components: [Row] });
    //Charts  
    if (ShowCharts) {
        const Charts = createCharts();
        for (const embeds of _.chunk(Charts, 10)) {
            await Messages[Index++].edit({ content: null, embeds: embeds, components: [] });
        }
    }
    Logger.debug("Messages updated");

    //Cooldown before refresh
    await sleepS(60);
    Button.setDisabled(false);
    await StatusMessage.edit({ components: [Row] });
    Button.setDisabled()
        .setEmoji(BotEmojis.Local.RAT_JAM)
        .setLabel("Обновление...");

    //Wait for press or disable after time
    await StatusMessage.awaitMessageComponent<ComponentType.Button>({ time: 4 * 60 * 1000 })
        .then((i) => {
            i.update({ components: [Row] });
            Logger.info(`Refresh clicked: ${i.user.tag}`);
        })
        .catch(() => StatusMessage.edit({ components: [Row] }));
}

function createCharts() {
    const Charts: EmbedBuilder[] = [];
    for (const H of History) {
        if (!H.playersChart) continue;

        // const Points: Chart.ChartPoint[] = H.players.data.map(p => ({ x: p.attributes.timestamp, y: p.attributes.max }));
        // const QC: QuickChart = new QuickChart()
        //     .setConfig({
        //         type: "line",
        //         data: {
        //             datasets: [{
        //                 data: Points,
        //                 borderColor: "#199F00",
        //                 borderWidth: 2
        //             }]
        //         },
        //         options: {
        //             legend: {
        //                 display: false
        //             },
        //             scales: {
        //                 xAxes: [{
        //                     type: "time"
        //                 }]
        //             }
        //         }
        //     });
        // const T = await QC.getShortUrl();

        const Chart = new EmbedBuilder()
            .setTitle(`[${H.server.number}]${H.server.name}`)
            .setColor(H.server.isOnline ? BotColors.Common.Green : BotColors.Common.Red)
            .setImage(H.playersChart);
        Charts.push(Chart);
    }
    return Charts;
}

const name = "Status Message";
const Service: Service = { name, initialize, reload };
const StatusMessage = { ...Service, updateMessages } as const;

export default StatusMessage;
