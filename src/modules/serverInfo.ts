import { queryGameServerInfo, queryGameServerPlayer } from "steam-server-query"
import { DateTime } from "luxon"
import log4js from "log4js";

import { sleep } from "../utils.js";
import { Config, Module } from "../models/index.js";
import { ARKBot } from "../ARKBot.js";

const LoopWait = 5 * 60 * 1000
const Logger = log4js.getLogger("Server Info")
let Config: Config
export const Servers: ARKServer[] = []

function Initialize(_: ARKBot, config: Config) {
    Config = config
}

async function Start(): Promise<void> {
    Reload()
    await Loop()
}

function Reload() {
    Servers.length = 0
    for (const server of Config.servers) {
        //const A = server.split(':')
        Servers.push({
            address: server.address,
            //IP: A[0],
            //Port: parseInt(A[1]),
            name: server.name,
            steamName: "",
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
    }
}

async function Loop() {
    for (; ;) {
        try {
            await CheckServers()
            await sleep(LoopWait)
        } catch (error) {
            Logger.error("Unknown error")
            Logger.error(error)
            await sleep(LoopWait * 2)
        }
    }
}

async function CheckServers() {
    Logger.debug("Servers query started")
    for (const server of Servers) {
        await CheckServer(server)
        await sleep(500)
    }
    Logger.debug("Servers query complete")
}

async function CheckServer(server: ARKServer): Promise<void> {
    try {
        const Info = await queryGameServerInfo(server.address)
        const Players = await queryGameServerPlayer(server.address)
        //const R = await queryGameServerRules(server.address)

        server.isOnline = true
        server.steamName = Info.name
        server.map = Info.map
        server.players.max = Info.maxPlayers
        server.players.online = Info.players

        server.players.list = Players.players.map((P) => ({
            Name: P.name.length == 0 ? "Who?" : P.name,
            Time: DateTime.fromSeconds(P.duration)
        } as Player))
        Logger.debug(`Server queryed: ${server.name}`)
    } catch (error) {
        Logger.warn(`Error querying server: ${server.name}`)
        Logger.warn(error)

        server.isOnline = false
        server.players.max = 0
        server.players.online = 0
        server.players.list = []
    }
    server.lastCheck = DateTime.now()
    //TODO Add saving to DB
}

export interface ARKServer {
    address: string,
    // IP: string,
    //Port: number,
    name: string,
    steamName: string
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

const Module: Module = { Initialize, Start, Reload }
export default Module
