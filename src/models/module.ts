import { Config } from "./config.js";
import { ARKBot } from "../ARKBot.js";

export interface Module {
    Initialize(client: ARKBot, config: Config): void;
    Start(): Promise<void>;
    Reload(): void;
}
