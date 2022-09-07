export * from "./messageHelper.js";
export * from "./stringHelpers.js";

export function timeout(ms: number): Promise<void> {
    return new Promise((_resolve, reject) => setTimeout(() => reject(new Error("")), ms));
}

/**
 * Sleep for ms
 * @param ms milliseconds
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms,));
}
