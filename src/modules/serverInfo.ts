import { queryGameServerInfo, queryGameServerPlayer, queryGameServerRules } from "steam-server-query"
import { DateTime } from "luxon"

import { Bot } from "..";
import { sleep } from "../utils";

const LoopWait = 5 * 60 * 1000
const Servers: ARKServer[] = []
let Loop: Promise<void> | null
let Enabled: boolean

async function CheckServers() {
    Bot.logger.debug("Server query started")
    const PP = Servers.map(CheckServer)
    await Promise.all(PP)
    Bot.logger.debug("Servers query complete")
}

async function CheckServer(server: ARKServer): Promise<void> {
    try {
        const T = await queryGameServerInfo(server.Address)
        const P = await queryGameServerPlayer(server.Address)
        const R = await queryGameServerRules(server.Address)

        server.IsOnline = true
        server.Players.Max = T.maxPlayers
        server.Players.Online = T.players
        server.Players.List = P.players.map((P) => ({
            Name: P.name,
            Time: DateTime.fromSeconds(P.duration)
        } as Player))

    } catch (error) {
        if (server.IsOnline) {
            Bot.logger.warn(`Servers - Error querying server: ${server.Name}`)
            Bot.logger.warn(error)
        }
        server.IsOnline = false
        server.Players.Max = 0
        server.Players.Online = 0
        server.Players.List = []
    }
}
/*
async function Reload() {
    Enabled = false
    if (Loop) { await Loop }

    Servers = [];
    Bot.config.Servers.forEach(server => {
        //const A = server.split(':')
        Servers.push({
            Address: server,
            //IP: A[0],
            //Port: parseInt(A[1]),
            Name: "",
            IsOnline: false,
            Map: "",
            Players: {
                Max: 0,
                Online: 0,
                List: []
            },
            History: []
        })
    });
    Enabled = true
    Loop = ServerLoop()
}
*/
async function ServerLoop() {
    while (Enabled) {
        try {
            await CheckServers()
            await sleep(LoopWait)
        } catch (error) {
            Bot.logger.error('Servers - Unknown error')
            Bot.logger.error(error)
            await sleep(LoopWait * 2)
        }
    }
    Loop = null;
}

interface ARKServer {
    Address: string,
    // IP: string,
    //Port: number,
    Name: string,
    IsOnline: boolean,
    Map: string,
    Players: {
        Online: number
        Max: number
        List: Player[]
    },
    History: OnlineCount[]
}
interface Player {
    Name: string,
    Time: DateTime
}

interface OnlineCount {
    Time: Date,
    Online: number
}