import { MessageActionRow, MessageButton, MessageEmbed, TextBasedChannel } from "discord.js";
import log4js from "log4js";
import _ from "lodash";

import { sleep } from "../utils.js";
import { CheckServers, Servers } from "./serverInfo.js";
import { Module, Config } from "../models/index.js";
import { ARKBot } from "../ARKBot.js";
import { prepareMessages } from "../helpers/messageHelper.js";
import { CommonColor, Emojis } from "../consts.js";

const LoopWait = 5 * 60 * 1000;
const Logger = log4js.getLogger("Status Message");

let Bot: ARKBot;
let Config: Config;
let Channel: TextBasedChannel;
let MessageCount = 1;

function Initialize(bot: ARKBot, config: Config) {
    Bot = bot;
    Config = config;
}

async function Start(): Promise<void> {
    Reload();
    await Loop();
}

async function Reload() {
    Channel = (await Bot.channels.fetch(Config.channel)) as TextBasedChannel;
    MessageCount = 1;//Math.ceil(Config.servers.length / 5) + 1;
}

async function Loop() {
    for (; ;) {
        try {
            await CheckServers();
            await UpdateMessages();
            //await sleep(LoopWait)
        } catch (error) {
            Logger.error("Unknown Error");
            Logger.error(error);
            await sleep(LoopWait);
        }
    }
}

function FixName(name: string) {
    return name.replace(/[\u{0080}-\u{03FF}\u{0500}-\u{FFFF}]/gmu, "?").substring(0, 15);
}

export async function UpdateMessages() {
    const Messages = await prepareMessages(Bot, Channel, MessageCount);
    let Index = 0;
    //Links Message
    /*
    const Rows: MessageActionRow[] = [];
    for (const S of Servers) {
        const Row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel(`${S.name} - BattleMetrics`)
                    .setStyle("LINK")
                    .setURL(`https://www.battlemetrics.com/servers/ark/${S.battlemetrics}`)
            );
        Rows.push(Row);
    }
    const RowChunks = _.chunk(Rows, 5);
    RowChunks.forEach(R => Messages[Index++].edit({ content: null, embeds: [], components: R }));
    */
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

    const Embed = new MessageEmbed()
        .setTitle("Статус серверов")
        .setDescription(Status)
        .setColor(CommonColor.Primary)
        .setFooter({ text: "Последнее обновление" })
        .setTimestamp(Date.now());
    //Add button for refresh
    const Button = new MessageButton()
        .setEmoji("🔄")
        .setLabel("Обновить")
        .setStyle("SECONDARY")
        .setCustomId("refresh")
        .setDisabled();

    const Row = new MessageActionRow()
        .addComponents(Button);

    const StatusMessage = await Messages[Index++].edit({ content: null, embeds: [Embed], components: [Row] });
    Logger.debug("Messages updated");
    //Cooldown before refresh
    await sleep(60 * 1000);
    Button.setDisabled(false);
    await StatusMessage.edit({ components: [Row] });
    Button.setDisabled()
        .setEmoji(Emojis.RAT_JAM)
        .setLabel("Обновление...");

    //Wait for press or disable after time
    await StatusMessage.awaitMessageComponent({ time: LoopWait })
        .then((i) => {
            i.update({ components: [Row] });
            Logger.info(`Refresh clicked: ${i.user.username}`);
        })
        .catch(() => {
            StatusMessage.edit({ components: [Row] });
        });
}

const Module: Module = { Initialize, Start, Reload };
export default Module;
