import { remote } from "electron";
import * as fs from "fs";
import { promisify } from "util";
const dialog = remote.dialog;
const fileOpen = promisify(fs.open);
const fileRead = promisify(fs.read);

import PC2DataProvider from "./PC2DataProvider";

export default async function loadFile(): Promise<string|undefined> {

    const path = dialog.showOpenDialog({
        filters: [{ name: "SimTelemetry Recording", extensions: ["str"] }]
    });

    if (!path) { return; }

    const fd = await fileOpen(path[0], fs.constants.O_RDONLY);
    const headerBuffer = Buffer.alloc(16);
    await fileRead(fd, headerBuffer, 0, 16, 0);

    const header = {
        magicWord: headerBuffer.toString("utf-8", 0, 3),
        version: headerBuffer.readUInt8(3),
        game: headerBuffer.toString("utf-8", 4, 8).replace(/\0/g, "")
    };

    if (header.magicWord !== "str") { return "Not a valid str file."; }
    if (header.version !== 1) { return `Unsupported version: ${header.version}`; }

    let clazz;
    switch (header.game) {
        case "PC2":
            clazz = PC2DataProvider;
            break;
        default:
            return `Unsupported game: ${header.game}`;
    }

    const dp = new clazz(fd);
    await dp.loadFile();

    // todo: make data provider globally available through vuex
    console.log(dp.packetCount);

    return;

}
