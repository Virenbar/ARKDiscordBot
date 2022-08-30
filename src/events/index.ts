import type { ClientEvents } from "discord.js";
import type { ARKBot } from "../ARKBot";
import CR from "./clientReady";
import IC from "./interactionCreate";
import MC from "./messageCreate";

function RegisterEvents(Bot: ARKBot): void {
    const E: EventHandler<keyof ClientEvents>[] = [CR, IC, MC];
    E.forEach(e => { Bot.on(e.event, e.execute); });

    //Bot.on(CR.event, async () => { await CR.execute() })
}

export interface EventHandler<T extends keyof ClientEvents> {
    name: string
    event: T
    disabled?: boolean
    execute(...args: ClientEvents[T]): Promise<void>

}

export default { RegisterEvents };

/*
export class Event<Key extends keyof ClientEvents> {
    constructor(
        public event: Key,
        public run: (...args: ClientEvents[Key]) => any
    ) {

    }
}
class s extends Event<"ready">{
    constructor() {
        super("ready")
    }
}*/
