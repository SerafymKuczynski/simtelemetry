import { dialog, ipcMain, IpcMessageEvent } from "electron";

import { default as PC2SimClient } from "./PC2SimClient";
import SimClient from "./SimClient";

// events
// clientStart
// clientStop
// clientStatusUpdate
// clientError

// commands
// getClients() -> getClientsResult(clients: string[])
// startClient(clientName: string)
// stopClient()
// saveRecording() -> saveRecordingResult(error: string | undefined)

let activeClient: SimClient | undefined;

const clients = [
    { name: "Project Cars 2", clazz: PC2SimClient }
];

ipcMain.on("getClients", (ev: IpcMessageEvent) => {
    ev.sender.send("getClientsResult", clients.map((x) => x.name));
});

ipcMain.on("startClient", (ev: IpcMessageEvent, name: string) => {

    console.log("START CLIENT");

    if (activeClient) {
        activeClient.removeAllListeners();
        activeClient = undefined;
    }

    const clientDescriptor = clients.find((x) => x.name === name);
    if (!clientDescriptor) {
        ev.sender.send("clientError", "Failed to find client " + name);
        return;
    }

    try {
        activeClient = new (clientDescriptor.clazz)();
        activeClient.on("stop", () => { ev.sender.send("clientStop"); });
        activeClient.on("status", (s) => { ev.sender.send("clientStatusUpdate", s); });
        activeClient.on("error", (e) => { ev.sender.send("clientError", e); });
        activeClient.start();
        ev.sender.send("clientStart");
    } catch (err) {
        ev.sender.send("clientError", "Failed to start client.");
    }

});

ipcMain.on("stopClient", (ev: IpcMessageEvent) => {

    if (!activeClient) {
        ev.sender.send("clientError", "Failed to stop client: No client active");
        return;
    }

    activeClient.stop();

});

ipcMain.on("saveRecording", async (ev: IpcMessageEvent) => {

    if (!activeClient) {
        ev.sender.send("saveRecordingResult", "No active client.");
        return;
    }

    const path = dialog.showSaveDialog({
        title: "Save Recording",
        filters: [{ name: "SimTelemetry Recording", extensions: ["str"] }]
    });
    if (!path) {
        ev.sender.send("saveRecordingResult", "User cancelled");
        return;
    }

    try {
        await activeClient.saveToFile(path);
        ev.sender.send("saveRecordingResult");
    } catch (err) {
        ev.sender.send("saveRecordingResult", err);
    }

});
