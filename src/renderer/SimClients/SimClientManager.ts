import { default as PC2SimClient } from "./PC2SimClient";
import SimClient from "./SimClient";
import { EventEmitter } from "events";

// events
// clientStart
// clientStop
// clientStatusUpdate(status: string)
// clientError(error: string)
// clientDataFrame(dataframe: ISimClientState)

class SimClientManager extends EventEmitter {

    public get clients() {
        return [
            { name: "Project Cars 2", clazz: PC2SimClient }
        ];
    }

    public get activeClient() {
        return this._activeClient;
    }

    private _activeClient?: SimClient;
    private activeTimer?: NodeJS.Timeout;

    public startClient(): void {

        if (this._activeClient) {
            this._activeClient.removeAllListeners();
            this._activeClient = undefined;
        }

        const clientDescriptor = this.clients.find((x) => x.name === name);
        if (!clientDescriptor) {
            throw new Error("Failed to find client " + name);
        }

        this._activeClient = new (clientDescriptor.clazz)();
        this._activeClient.on("stop", () => { this.emit("clientStop"); });
        this._activeClient.on("status", (s) => { this.emit("clientStatusUpdate", s); });
        this._activeClient.on("error", (e) => { this.emit("clientError", e); });
        this._activeClient.start();
        this.emit("clientStart");
        this.activeTimer = setInterval(() => {
            if (this._activeClient) {
                this.emit("clientDataFrame", this._activeClient!.state);
            } else {
                console.log("Timer active but no client");
                clearInterval(this.activeTimer!);
            }
        }, 1000 / 30);

    }

    public stopClient(): void {

        if (!this._activeClient) {
            throw new Error("Failed to stop client: No client active");
        }

        if (this.activeTimer) {
            clearInterval(this.activeTimer);
        }

        this._activeClient.stop();

    }

}

export default new SimClientManager();
