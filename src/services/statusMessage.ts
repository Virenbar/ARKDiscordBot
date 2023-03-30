import {
    ActionRowBuilder,
    BaseGuildTextChannel,
    ButtonBuilder, ButtonStyle, ComponentType,
    EmbedBuilder,
    Message
} from "discord.js";
import _ from "lodash";
import log4js from "log4js";
import type { ARKBot } from "../ARKBot.js";
import { BotEmojis } from "../constants.js";
import { createTable, getCharts, getGuildColor, prepareMessages, sleepS } from "../helpers/index.js";
import type { Service } from "./index.js";
import ServerHistory from "./serverHistory.js";
import ServerInfo, { ARKServer } from "./serverInfo.js";

const Logger = log4js.getLogger("Status Message");
let Client: ARKBot;
let ShowCharts = false;

const PVPData: Data = { servers: [], history: [] };
const PVEData: Data = { servers: [], history: [] };

function initialize(client: ARKBot) {
    Client = client;
}

function reload() {
    ShowCharts = Client.config.showCharts;
    // PVP
    PVPData.servers = ServerInfo.PVPServers;
    PVPData.history = ServerHistory.PVPHistory;
    // PVE
    PVEData.servers = ServerInfo.PVEServers;
    PVEData.history = ServerHistory.PVEHistory;
}

async function start() {
    const PVP = Loop(refreshPVP);
    const PVE = Loop(refreshPVE);
    await Promise.all([PVP, PVE]);
}

async function refreshPVP() {
    const channel = await Client.getPVPStatusChannel();
    await ServerInfo.refreshPVP();
    const C = await updateMessages(channel, PVPData);
    await awaitRefresh(C);
}

async function refreshPVE() {
    const channel = await Client.getPVEStatusChannel();
    await ServerInfo.refreshPVE();
    const C = await updateMessages(channel, PVEData);
    await awaitRefresh(C);
}

async function forceRefresh() {
    await ServerInfo.refreshPVP();
    await updateMessages(await Client.getPVPStatusChannel(), PVPData);
    await ServerInfo.refreshPVE();
    await updateMessages(await Client.getPVEStatusChannel(), PVEData);
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

async function updateMessages(channel: BaseGuildTextChannel, data: Data) {
    const servers = data.servers;
    const history = data.history;
    // Status Message
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

    // Update messages
    const messageCount = ShowCharts ? Math.ceil(servers.length / 10) + 1 : 1;
    let Index = 0;
    const messages = await prepareMessages(Client, channel, messageCount);
    const statusMessage = await messages[Index++].edit({ content: null, embeds: [Embed] });

    // Charts  
    if (ShowCharts) {
        const Charts = getCharts(history);
        for (const embeds of _.chunk(Charts, 10)) {
            await messages[Index++].edit({ content: null, embeds: embeds, components: [] });
        }
    }
    Logger.debug(`Messages updated: ${channel.id}`);
    return statusMessage;
}

async function awaitRefresh(message: Message) {
    // Refresh Button
    const button = new ButtonBuilder()
        .setEmoji("🔄")
        .setLabel("Обновить")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("refresh")
        .setDisabled();

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(button);

    await message.edit({ components: [row] });

    // Cooldown before refresh
    await sleepS(60);
    button.setDisabled(false);
    await message.edit({ components: [row] });
    const emoji = <string>_.sample([
        BotEmojis.Local.ratDance,
        BotEmojis.Local.pugDance,
        BotEmojis.Local.vicksyDance
    ]);
    button.setDisabled()
        .setEmoji(emoji)
        .setLabel("Обновление...");

    // Wait for press or disable after timeout
    try {
        const i = await message.awaitMessageComponent<ComponentType.Button>({ time: 4 * 60 * 1000 });
        i.update({ components: [row] });
        Logger.info(`Refresh clicked: ${i.message.id} ~ ${i.user.tag}`);
    } catch (error) {
        message.edit({ components: [row] });
    }
}

const name = "Status Message";
const Service: Service = { name, initialize, reload, start };
const StatusMessage = { ...Service, forceRefresh } as const;

export default StatusMessage;

interface Data {
    servers: ARKServer[]
    history: ServerHistory[]
}
