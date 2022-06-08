import { ApplicationCommandData, ApplicationCommandOptionData, Collection, CommandInteraction, ContextMenuInteraction, Snowflake } from "discord.js";
import fs from "fs";
import path from "path";
import { ARKBot } from "../ARKBot";

export const Commands = new Collection<string, ICommand>();
export const ContextMenus = new Collection<string, IContextMenu>();

const PathC = path.join(__dirname, "./commands/")
const PathCM = path.join(__dirname, "./menus/")

let Bot: ARKBot
let Config: { guild: Snowflake, channel: Snowflake }

export async function Load(client: ARKBot): Promise<void> {
    Bot = client
    //Config = client.config.primary
    try {
        const commandFiles = fs.readdirSync(PathC).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command: ICommand = await import(PathC + file);
            Commands.set(command.name, command);
        }
        const menuFiles = fs.readdirSync(PathCM).filter(file => file.endsWith(".js"));
        for (const file of menuFiles) {
            const command: IContextMenu = await import(PathCM + file);
            ContextMenus.set(command.name, command);
        }
    } catch (err) {
        Bot.logger.error("Error loading interactions module")
        Bot.logger.error(err)
    }
}
/*
async function ExecuteC(interaction: Interaction) {
    if (interaction.isCommand()) {
    }
}*/

export async function Deploy(): Promise<void> {
    const CommandData: ApplicationCommandData[] = []
    Commands.forEach(C => {
        CommandData.push({ name: C.name, description: C.description, options: C.options })
    });
    ContextMenus.forEach(CM => {
        CommandData.push({ name: CM.name, type: "USER" })
    });
    (await Bot.guilds.fetch(Config.guild)).commands.set(CommandData)

    Bot.logger.info("Interactions deployed")
}


export interface ICommand {
    name: string
    description: string
    cooldown: number
    options?: ApplicationCommandOptionData[],
    execute(Interaction: CommandInteraction): Promise<void>
}

export interface IContextMenu {
    name: string
    cooldown: number
    execute(Interaction: ContextMenuInteraction): Promise<void>
}

export default { Load }