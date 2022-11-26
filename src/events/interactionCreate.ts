import { ApplicationCommandType, BaseGuildTextChannel, ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import type { AutocompleteCommand, BotCommand } from "../commands/command.js";
import { getSMDEmbed } from "../helpers/index.js";
import { Client, EventHandler, Logger } from "./index.js";

const event: EventHandler<"interactionCreate"> = {
    event: "interactionCreate",
    async execute(i): Promise<void> {
        try {
            if (!(
                i.isCommand() ||
                i.isAutocomplete()
            )) { return; }

            const Command = Client.commands.get(i.commandName) as BotCommand;

            switch (i.commandType) {
                case ApplicationCommandType.ChatInput:
                    if (i.isAutocomplete()) {
                        const Autocomplete = Command as AutocompleteCommand;
                        Logger.debug(`Autocomplete: ${Autocomplete.name()} ~ ${i.user.tag}`);
                        await Autocomplete.handleAutocomplete(i);
                    } else {
                        if (!checkCooldown(Command, i)) { return; }
                        if (!await checkAccess(Command, i)) { return; }
                        if (!await checkNSFW(Command, i)) { return; }
                        Logger.info(`ChatInputCommand: ${Command.name()} ~ ${i.user.tag}`);
                        await Command.execute(i);
                    }
                    break;
                case ApplicationCommandType.User:
                    Logger.info(`UserMenu: ${Command.name()} ~ ${i.user.tag} ~ ${i.targetUser.tag}`);
                    await Command.execute(i);
                    break;
                case ApplicationCommandType.Message:
                    Logger.info(`MessageMenu: ${Command.name()} ~ ${i.user.tag} ~ ${i.targetMessage.id}`);
                    await Command.execute(i);
                    break;
                default:
                    break;
            }
        } catch (e) {
            const error = e as Error;
            Logger.error(error, error.message);
            if (!i.isCommand()) { return; }
            try {
                if (!(i.deferred || i.replied)) {
                    Logger.warn(`Interaction ${i.commandName} ~ ${i.user.tag}`, "Interaction not deferred");
                    await i.deferReply({ ephemeral: true });
                }
                await i.editReply({ content: error.message });
            } catch (e) {
                const error = e as Error;
                Logger.error(error, error.message);

                await i.followUp({ content: error.message, ephemeral: true });
            }
        }
    }
};

async function checkAccess(command: BotCommand, i: CommandInteraction) {
    if (command.isOwnerOnly && !Client.isOwner(i.user.id)) {
        await i.reply({ ephemeral: true, content: "⚠️ ACCESS DENIED ⚠️" });
        Logger.info(`Access Check: ${command.name()} ~ ${i.user.tag}`);
        return false;
    }
    return true;
}

async function checkNSFW(command: BotCommand, i: CommandInteraction) {
    if (!i.guild) { return true; }
    if (!i.channel) { throw new Error("Unknown channel"); }

    const channel = await i.channel.fetch() as BaseGuildTextChannel;
    if (command.isNSFW && !channel.nsfw) {
        await i.reply({ ephemeral: true, embeds: [getSMDEmbed(i)] });
        Logger.info(`NSFW Check: ${command.name()} ~ ${i.user.tag}`);
        return false;
    }
    return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function checkCooldown(_command: BotCommand, _i: ChatInputCommandInteraction) {

    //TODO Cooldown check
    return true;
}
export default event;
