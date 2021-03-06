import { Interaction } from "discord.js";

import { EventHandler } from "./index.js";
import { Bot } from "../index.js";
import { Commands, ContextMenus } from "../interactions/index.js";

const event: EventHandler<"interactionCreate"> = {
    name: "Interaction Create",
    event: "interactionCreate",
    async execute(i: Interaction): Promise<void> {
        try {
            /*if (i.isCommand() || i.isContextMenu()) {
                Bot.logger.info(`User: ${i.user.username} Command: ${i.commandName}`)
                i.reply({ ephemeral: true, content: "E" })
            } else {
                Bot.logger.error("Unknown interaction")
                Bot.logger.error(i.toJSON())
            }*/

            if (i.isCommand() && Commands.has(i.commandName)) {
                Bot.logger.info(`User: ${i.user.username} Command: ${i.commandName}`);
                await Commands.get(i.commandName)?.execute(i);
            } else if (i.isContextMenu() && ContextMenus.has(i.commandName)) {
                Bot.logger.info(`User: ${i.user.username} Context menu: ${i.commandName}`);
                await ContextMenus.get(i.commandName)?.execute(i);
            } else {
                //Bot.logger.error("Unknown interaction")
                //Bot.logger.error(i.toJSON())
            }
        } catch (error) {
            Bot.logger.error(`Interaction failed: ${i.id}`);
            Bot.logger.error(error);
        }
    }
};

export default event;
