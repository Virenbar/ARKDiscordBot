import { ClientEvents } from "discord.js";
import { ARKBot } from "../ARKBot";
import CR from "./clientReady";
import IC from "./interactionCreate"

export function RegisterEvents(Bot: ARKBot): void {
    const E = [CR, IC]
    E.forEach(e => { Bot.on(e.event, e.execute) })
    //Bot.on(CR.event, async () => { await CR.execute() })
}

export interface IEvent {
    name: string
    event: keyof ClientEvents
    disabled?: boolean
    execute(...args: unknown[]): Promise<void>
}

export default { RegisterEvents }