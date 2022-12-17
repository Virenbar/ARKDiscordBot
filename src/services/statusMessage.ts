import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    ComponentEmojiResolvable, ComponentType,
    EmbedBuilder
} from "discord.js";
import _ from "lodash";
import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import { BotColors, BotEmojis } from "../constants.js";
import { createTable, getGuildColor, prepareMessages, sleepS } from "../helpers/index.js";
import type { Service } from "./index.js";
import { History } from "./serverHistory.js";
import { Servers } from "./serverInfo.js";

const Logger = log4js.getLogger("Status Message");
let Client: ARKBot;
let messageCount = 1;
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
    const players = _.flatMap(Servers, (S) => S.players.list);
    let status = "";
    for (const S of Servers) {
        status += `${S.isOnline ? ":green_circle:" : ":red_circle:"} [${S.number}]**${S.name}** `;
        status += S.battlemetrics ?
            `[(${S.players.online}/${S.players.max})](https://www.battlemetrics.com/servers/ark/${S.battlemetrics})\n` :
            `(${S.players.online}/${S.players.max})\n`;
    }
    if (players.length > 0) {
        status += `\n**Список игроков (${players.length})**\n`;
        const list = Servers.flatMap(S => S.players.list.map(P => ({
            Name: P.Name,
            Server: S.name,
            Time: P.Time.toFormat("hh:mm:ss")
        })));
        status += "```";
        list.unshift({ Name: "Игрок", Server: "Сервер", Time: "Время игры" });
        status += createTable(list, { "Name": 20 });
        status += "```";
    }
    const Embed = new EmbedBuilder()
        .setTitle("Статус серверов")
        .setDescription(status)
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
    messageCount = ShowCharts ? Math.ceil(Servers.length / 10) + 1 : 1;
    let Index = 0;
    const messages = await prepareMessages(Client, Channel, messageCount);
    const statusMessage = await messages[Index++].edit({ content: null, embeds: [Embed], components: [Row] });
    //Charts  
    if (ShowCharts) {
        const Charts = createCharts();
        for (const embeds of _.chunk(Charts, 10)) {
            await messages[Index++].edit({ content: null, embeds: embeds, components: [] });
        }
    }
    Logger.debug("Messages updated");

    //Cooldown before refresh
    await sleepS(60);
    Button.setDisabled(false);
    await statusMessage.edit({ components: [Row] });
    const emoji = <ComponentEmojiResolvable>_.sample([
        BotEmojis.Local.ratDance,
        BotEmojis.Local.pugDance,
        BotEmojis.Local.vicksyDance
    ]);
    Button.setDisabled()
        .setEmoji(emoji)
        .setLabel("Обновление...");

    //Wait for press or disable after timeout
    await statusMessage.awaitMessageComponent<ComponentType.Button>({ time: 4 * 60 * 1000 })
        .then((i) => {
            i.update({ components: [Row] });
            Logger.info(`Refresh clicked: ${i.user.tag}`);
        })
        .catch(() => statusMessage.edit({ components: [Row] }));
}

function createCharts() {
    const charts: EmbedBuilder[] = [];
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

        const chart = new EmbedBuilder()
            .setTitle(`[${H.server.number}]${H.server.name}`)
            .setColor(H.server.isOnline ? BotColors.Common.Green : BotColors.Common.Red)
            .setImage(H.playersChart);
        charts.push(chart);
    }
    return charts;
}

const name = "Status Message";
const Service: Service = { name, initialize, reload };
const StatusMessage = { ...Service, updateMessages } as const;

export default StatusMessage;
