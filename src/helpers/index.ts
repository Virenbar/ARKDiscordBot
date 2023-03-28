import type { CommandInteraction, Guild } from "discord.js";
import { BotColors } from "../constants.js";

export * from "./button.js";
export * from "./embed/chart.js";
export * from "./embed/SMD.js";
export * from "./fetch.js";
export * from "./math.js";
export * from "./message.js";
export * from "./string.js";

/**
 * Sleep for ms
 * @param ms milliseconds
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sleep for {@link ms} milliseconds
 * @param ms milliseconds
 */
export function sleepMS(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sleep for {@link s} seconds
 * @param s seconds
 */
export function sleepS(s: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

/**
 * Color of bot in guild
 * @deprecated
 */
export function getColor(i: CommandInteraction) {
    return i.guild?.members?.me?.displayColor ?? BotColors.Common.Primary;
}

/**
 * Color of bot in guild
 */
export function getGuildColor(guild: Guild | null) {
    return guild?.members?.me?.displayColor ?? BotColors.Common.Primary;
}
