/**
 * Sleep for ms
 * @param ms milliseconds
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms,));
}

/**
 * Escape markdown chars
 */
export function fixMD(str: string): string {
    return str.replace(/_/g, "\\_").replace(/\*/g, "\\*");
}

/**
 * Format bytes to string
 * https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
 * @returns {string}
 */
export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * 
 * @returns {string} **Label:** Text
 */
export function labelString(label: string, text: string): string {
    return `**${label}:** ` + text;
}

export function timeout(ms: number): Promise<void> {
    return new Promise((_resolve, reject) => setTimeout(() => reject(new Error("")), ms));
}

export async function withTimeout<T>(promise: () => Promise<T>, ms: number, message?: string): Promise<T> {
    let timeoutHandle: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_resolve, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error(message)), ms);
    });

    const result = await Promise.race([
        promise(),
        timeoutPromise,
    ]);
    clearTimeout(timeoutHandle!);
    return result;
}
