import { Constants } from "discord.js";

import { IEvent } from ".";
import { Bot } from "..";
//import { Deploy } from "../interactions";

const event: IEvent = {
    name: 'Client Ready',
    event: Constants.Events.CLIENT_READY,
    async execute(): Promise<void> {
        Bot.logger.info(`Logged in as ${Bot.user?.tag}!`)
        //await Deploy()
    }
}

export = event