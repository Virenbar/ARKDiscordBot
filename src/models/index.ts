import type { ARKBot } from "../ARKBot.js";

export * from "./config.js";
export * from "./command.js";

export interface Initializable {
    initialize(client: ARKBot): void
}
