import { EventEmitter } from "events";

export interface ISimClientStatusUpdate {
    status: string;
}

export interface ISimClient {
    on(event: "status", listener: (status: ISimClientStatusUpdate) => void): this;
    on(event: "stop", listener: () => void): this;
    on(event: "error", listener: (error: string) => void): this;
}

export default abstract class SimClient extends EventEmitter implements ISimClient {

    protected _isRunning = false;
    public get isRunning() {
        return this._isRunning;
    }

    protected options: any;

    constructor(options?: any) {
        super();
        this.options = options;
    }

    public abstract start(): void;
    public abstract stop(): void;

}
