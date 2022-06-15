import { ClientEvents } from "discord.js";
import { ARKBot } from "../ARKBot.js";
import CR from "./clientReady.js";
import IC from "./interactionCreate.js";
import MC from "./messageCreate.js";

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
