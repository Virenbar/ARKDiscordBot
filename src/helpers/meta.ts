import fs from "fs";
import { DateTime, Duration } from "luxon";
import os from "os";
import process, { memoryUsage, uptime } from "process";

// Package
const pack = new URL("../../package.json", import.meta.url);
const json = JSON.parse(fs.readFileSync(pack, "utf8"));
const version = json["version"] as string;
const repository = json["repository"]["url"] as string;
const dependencies = Object.keys(json["dependencies"]).length;

// System
const cpu = os.cpus();
const CPU = `${cpu[0].model} ${cpu.length}x${cpu[0].speed} MHz`;
const OS = `${os.version()}(${os.release()})`;
const nodeVersion = process.version;

function timings() {
    const process = Duration.fromMillis(uptime() * 1000);
    const system = Duration.fromMillis(os.uptime() * 1000);
    const boot = DateTime.local().minus(system);
    return {
        boot,
        uptime: {
            system,
            process
        }
    };
}

function memory() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const process = memoryUsage().heapTotal;
    return {
        total,
        used,
        free,
        process
    };
}

export default {
    version,
    repository,
    dependencies,
    nodeVersion,
    CPU,
    OS,
    timings,
    memory
};
