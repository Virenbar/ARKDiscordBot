import type { Config } from "./config";
import type { ARKBot } from "../ARKBot";

export interface Service {
    Initialize(client: ARKBot, config: Config): void;
    Start(): Promise<void>;
    Reload(): void;
}
