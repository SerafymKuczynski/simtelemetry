import { ipcMain, IpcMessageEvent } from "electron";
import DataRecorder from "../DataRecorder";
import { default as PC2Receiver } from "./PC2/PC2Receiver";
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
// saveRecording(path: string) -> saveRecordingResult(error: string | undefined)

let activeClient: SimClient | undefined;
let activeRecorder: DataRecorder | undefined;

const clients = [
    { name: "Project Cars 2", clazz: PC2Receiver }
];

ipcMain.on("getClients", (ev: IpcMessageEvent) => {
    ev.sender.send("getClientsResult", clients.map((x) => x.name));
});

ipcMain.on("startClient", (ev: IpcMessageEvent, name: string) => {

    console.log("START CLIENT");

    if (activeClient) {
        ev.sender.send("clientError", "A client is already running.");
        return;
    }

    const clientDescriptor = clients.find((x) => x.name === name);
    if (!clientDescriptor) {
        ev.sender.send("clientError", "Failed to find client " + name);
        return;
    }

    try {
        activeClient = new (clientDescriptor.clazz)();
        activeRecorder = new DataRecorder();
        activeClient.on("stop", () => {
            activeClient!.removeAllListeners();
            activeClient = undefined;
            ev.sender.send("clientStop");
        });
        activeClient.on("status", (s) => { ev.sender.send("clientStatusUpdate", s); });
        activeClient.on("error", (e) => { ev.sender.send("clientError", e); });
        activeClient.on("data", (d) => { activeRecorder!.savePoint(d); });
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

    activeClient.removeAllListeners();
    activeClient.stop();
    activeClient = undefined;
    ev.sender.send("clientStop");

});

ipcMain.on("saveRecording", async (ev: IpcMessageEvent, path: string) => {

    if (!activeRecorder) {
        ev.sender.send("saveRecordingResult", "No records.");
        return;
    }

    try {
        await activeRecorder.saveToFile(path);
        ev.sender.send("saveRecordingResult");
    } catch (err) {
        ev.sender.send("saveRecordingResult", err);
    }

    activeRecorder = undefined;

});
