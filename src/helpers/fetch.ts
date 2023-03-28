
import log4js from "log4js";

const Logger = log4js.getLogger("Fetch");

export async function get<T>(url: string) {
    const response = await fetch(url, { headers: { "User-Agent": "ARA/4.2 (ARKDiscordBot)" } });
    if (!response.ok) {
        Logger.error(await response.text());
        throw new Error(`${response.status}: ${response.statusText}`);
    }
    return await response.json() as T;
}
