import {
    ActionRowBuilder,
    BaseGuildTextChannel,
    ButtonBuilder, ButtonStyle, ComponentType,
    EmbedBuilder
} from "discord.js";
import _ from "lodash";
import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import { BotEmojis } from "../constants.js";
import { createTable, getCharts, getGuildColor, prepareMessages, sleepS } from "../helpers/index.js";
import type { Service } from "./index.js";
import { PVPHistory } from "./serverHistory.js";
import ServerInfo, { ARKServer, PVEServers, PVPServers } from "./serverInfo.js";

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

async function start() {
    const PVP = Loop(refreshPVP);
    const PVE = Loop(refreshPVE);
    await Promise.all([PVP, PVE]);
}

async function refreshPVP() {
    const channel = await Client.getPVPStatusChannel();
    await ServerInfo.refreshPVP();
    await updateMessages(channel, PVPServers);
}

async function refreshPVE() {
    const channel = await Client.getPVEStatusChannel();
    await ServerInfo.refreshPVE();
    await updateMessages(channel, PVEServers);
}

async function Loop(func: () => Promise<void>) {
    for (; ;) {
        try {
            await func();
        } catch (error) {
            Logger.error(error);
            await sleepS(5 * 60);
        }
    }
}

async function updateMessages(channel: BaseGuildTextChannel, servers: ARKServer[]) {
    //Status Message
    const players = _.flatMap(servers, (S) => S.players.list);
    let status = "";
    for (const S of servers) {
        status += `${S.isOnline ? ":green_circle:" : ":red_circle:"} [${S.number}]**${S.name}** `;
        status += S.battlemetrics ?
            `[(${S.players.online}/${S.players.max})](https://www.battlemetrics.com/servers/ark/${S.battlemetrics})\n` :
            `(${S.players.online}/${S.players.max})\n`;
    }
    if (players.length > 0) {
        status += `\n**Список игроков (${players.length})**\n`;
        const list = servers.flatMap(S => S.players.list.map(P => ({
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
        .setColor(getGuildColor(channel.guild))
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
    messageCount = ShowCharts ? Math.ceil(servers.length / 10) + 1 : 1;
    let Index = 0;
    const messages = await prepareMessages(Client, channel, messageCount);
    const statusMessage = await messages[Index++].edit({ content: null, embeds: [Embed], components: [Row] });
    //Charts  
    if (ShowCharts) {
        const Charts = getCharts(PVPHistory);
        for (const embeds of _.chunk(Charts, 10)) {
            await messages[Index++].edit({ content: null, embeds: embeds, components: [] });
        }
    }
    Logger.debug(`Messages updated: ${channel.id}`);

    //Cooldown before refresh
    await sleepS(60);
    Button.setDisabled(false);
    await statusMessage.edit({ components: [Row] });
    const emoji = <string>_.sample([
        BotEmojis.Local.ratDance,
        BotEmojis.Local.pugDance,
        BotEmojis.Local.vicksyDance
    ]);
    Button.setDisabled()
        .setEmoji(emoji)
        .setLabel("Обновление...");

    //Wait for press or disable after timeout
    try {
        const i = await statusMessage.awaitMessageComponent<ComponentType.Button>({ time: 4 * 60 * 1000 });
        i.update({ components: [Row] });
        Logger.info(`Refresh clicked: ${i.message.id} ~ ${i.user.tag}`);
    } catch (error) {
        statusMessage.edit({ components: [Row] });
    }
}

const name = "Status Message";
const Service: Service = { name, initialize, reload, start };
const StatusMessage = { ...Service, refreshPVP, refreshPVE } as const;

export default StatusMessage;
