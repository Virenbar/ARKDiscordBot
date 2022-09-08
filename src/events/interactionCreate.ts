import type { CommandInteraction, Interaction } from "discord.js";
import { Client } from "../index.js";
import type { BotCommand } from "../models/command.js";
import type { EventHandler } from "./index.js";

const event: EventHandler<"interactionCreate"> = {
    name: "Interaction Create",
    event: "interactionCreate",
    async execute(i: Interaction): Promise<void> {
        try {
            if (i.isCommand() && Client.commands.has(i.commandName)) {
                const Command = Client.commands.get(i.commandName) as BotCommand;

                //TODO Cooldown check
                // Access check
                if (Command.isTeamOnly && !Client.isTeamMember(i.user.id)) {
                    await i.reply("ACCESS DENIED");
                    return;
                }
                await ExecuteCommand(Command, i);
            } else {
                Client.logger.debug(`Unknown interaction: ${i.id}`);
            }
        } catch (error) {
            Client.logger.error(`Interaction failed: ${i.id}`);
            Client.logger.error(error);
        }
    }
};

async function ExecuteCommand(command: BotCommand, i: CommandInteraction) {
    if (i.isChatInputCommand()) {
        Client.logger.info(`User: ${i.user.tag} SlashCommand: ${command.name()}`);
        command.execute(i);
    } else if (i.isUserContextMenuCommand()) {
        Client.logger.info(`User: ${i.user.tag} UserMenu: ${command.name()}`);
        command.execute(i);
    } else if (i.isMessageContextMenuCommand()) {
        Client.logger.info(`User: ${i.user.tag} MessageMenu: ${command.name()}`);
        command.execute(i);
    } else {
        throw new Error("Invalid BotCommand");
    }
}
export default event;
