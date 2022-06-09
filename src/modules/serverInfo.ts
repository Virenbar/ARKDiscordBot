import { queryGameServerInfo, queryGameServerPlayer, queryGameServerRules } from "steam-server-query"
import { DateTime } from "luxon"

import { sleep } from "../utils";
import { Module } from ".";

const LoopWait = 5 * 60 * 1000

export default class ServerInfo extends Module {
    constructor() {
        super("Server Info")
    }
    public Servers: ARKServer[] = []

    public async Start(): Promise<void> {
        this.Reload()
        await this.Loop()
    }

    public Reload() {
        this.Servers.length = 0
        this.bot.config.servers.forEach((name, address) => {
            //const A = server.split(':')
            this.Servers.push({
                address: address,
                //IP: A[0],
                //Port: parseInt(A[1]),
                name: name,
                isOnline: false,
                map: "",
                players: {
                    max: 0,
                    online: 0,
                    list: []
                },
                lastCheck: DateTime.now(),
                history: []
            })
        });
    }

    async Loop() {
        for (; ;) {
            try {
                await this.CheckServers()
                await sleep(LoopWait)
            } catch (error) {
                this.logger.error("Unknown error")
                this.logger.error(error)
                await sleep(LoopWait * 2)
            }
        }
    }

    async CheckServers() {
        this.logger.debug("Servers query started")
        const PP = this.Servers.map(this.CheckServer)
        await Promise.all(PP)
        this.logger.debug("Servers query complete")
    }

    async CheckServer(server: ARKServer): Promise<void> {
        try {
            const T = await queryGameServerInfo(server.address)
            const P = await queryGameServerPlayer(server.address)
            const R = await queryGameServerRules(server.address)

            server.isOnline = true
            server.players.max = T.maxPlayers
            server.players.online = T.players
            server.players.list = P.players.map((P) => ({
                Name: P.name,
                Time: DateTime.fromSeconds(P.duration)
            } as Player))

            this.logger.debug(`Rule count: ${R.ruleCount}`)
        } catch (error) {
            if (server.isOnline) {
                this.logger.warn(`Error querying server: ${server.name}`)
                this.logger.warn(error)
            }
            server.isOnline = false
            server.players.max = 0
            server.players.online = 0
            server.players.list = []
        }
        server.lastCheck = DateTime.now()
        //TODO Add saving to DB
    }
}

export interface ARKServer {
    address: string,
    // IP: string,
    //Port: number,
    name: string,
    isOnline: boolean,
    map: string,
    players: {
        online: number
        max: number
        list: Player[]
    },
    lastCheck: DateTime
    history: OnlineCount[]
}
interface Player {
    Name: string,
    Time: DateTime
}

interface OnlineCount {
    Time: DateTime,
    Online: number
}
