import { ipcMain, IpcMessageEvent, WebContents } from "electron";
import DataRecorder from "../DataRecorder";
import { default as PC2Receiver } from "./PC2/PC2Receiver";
import SimClient from "./SimClient";

let wc: WebContents | undefined;

export function init(wcontents: WebContents) {
    wc = wcontents;
}

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

ipcMain.on("getClients", () => {
    wc!.send("getClientsResult", clients.map((x) => x.name));
});

ipcMain.on("startClient", (ev: IpcMessageEvent, name: string) => {

    console.log("START CLIENT");

    if (activeClient) {
        wc!.send("clientError", "A client is already running.");
        return;
    }

    const clientDescriptor = clients.find((x) => x.name === name);
    if (!clientDescriptor) {
        wc!.send("clientError", "Failed to find client " + name);
        return;
    }

    try {
        activeClient = new (clientDescriptor.clazz)();
        activeRecorder = new DataRecorder();
        activeClient.on("stop", () => {
            activeClient!.removeAllListeners();
            activeClient = undefined;
            wc!.send("clientStop");
        });
        activeClient.on("status", (s) => { wc!.send("clientStatusUpdate", s); });
        activeClient.on("error", (e) => { wc!.send("clientError", e); });
        activeClient.on("data", (d) => { activeRecorder!.savePoint(d); });
        activeClient.start();
        wc!.send("clientStart");
    } catch (err) {
        wc!.send("clientError", "Failed to start client.");
    }

});

ipcMain.on("stopClient", () => {

    if (!activeClient) {
        wc!.send("clientError", "Failed to stop client: No client active");
        return;
    }

    activeClient.removeAllListeners();
    activeClient.stop();
    activeClient = undefined;
    wc!.send("clientStop");

});

ipcMain.on("saveRecording", async (ev: IpcMessageEvent, path: string) => {

    if (!activeRecorder) {
        wc!.send("saveRecordingResult", "No records.");
        return;
    }

    try {
        await activeRecorder.saveToFile(path);
        wc!.send("saveRecordingResult");
    } catch (err) {
        wc!.send("saveRecordingResult", err);
    }

    activeRecorder = undefined;

});
