import { Server } from "@fabricio-191/valve-server-query"
import { Channel } from "discord.js";
import { Bot } from "..";
import { ARK66Config } from '../config';
import { sleep, withTimeout } from "../utils";

const LoopWait = 5 * 60 * 1000
let Servers: ARKServer[] = []
let Loop: Promise<void>
let Enabled: boolean

async function CheckServers() {

}
async function Reload() {
    Enabled = false
    if (Loop) { await Loop }

    Servers = [];
    Bot.config.Servers.forEach(server => {
        const Address = server.split(':')
        Servers.push({
            IP: Address[0],
            Port: parseInt(Address[1]),
            Name: "",
            IsOnline: false,
            Map: "",
            Online: 0,
            MaxOnline: 0,
            Players: [],
            History: []
        })
    });
    Enabled = true
    ServerLoop()
}

async function ServerLoop() {
    while (Enabled) {
        try {
            await withTimeout(CheckServers, 60 * 60 * 1000, "Server timeouted")
            await sleep(LoopWait)
        } catch (err) {
            Bot.logger.error('Servers - Unknown error')
            Bot.logger.error(err)
            await sleep(LoopWait * 2)
        }
    }
}



interface ARKServer {
    IP: string,
    Port: number,
    Name: string,
    IsOnline: boolean,
    Map: string,
    Online: number,
    MaxOnline: number,
    Players: Player[],
    History: OnlineCount[]
}
interface Player {
    Name: string,
    Time: Date
}

interface OnlineCount {
    Time: Date,
    Online: number
}