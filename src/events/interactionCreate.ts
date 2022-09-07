import type { Interaction } from "discord.js";
import type { EventHandler } from "./index.js";
import { Client } from "../index.js";

const event: EventHandler<"interactionCreate"> = {
    name: "Interaction Create",
    event: "interactionCreate",
    async execute(i: Interaction): Promise<void> {

        //TODO Cooldown
        try {
            if (i.isChatInputCommand() && Client.commands.has(i.commandName)) {
                Client.logger.info(`User: ${i.user.username} Command: ${i.commandName}`);
                await Client.commands.get(i.commandName)?.execute(i);
            } else if (i.isUserContextMenuCommand() && Client.userMenus.has(i.commandName)) {
                Client.logger.info(`User: ${i.user.username} Context menu: ${i.commandName}`);
                await Client.userMenus.get(i.commandName)?.execute(i);
            } else if (i.isMessageContextMenuCommand() && Client.messageMenus.has(i.commandName)) {
                Client.logger.info(`User: ${i.user.username} Context menu: ${i.commandName}`);
                await Client.messageMenus.get(i.commandName)?.execute(i);
            } else {
                Client.logger.error("Unknown interaction");
                Client.logger.error(i.toJSON());
            }
        } catch (err) {
            Client.logger.error(`Interaction failed: ${i.id}`);
            Client.logger.error(err);
        }
    }
};

export default event;
