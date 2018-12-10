import { EventEmitter } from "events";
import { IType } from "../Games/PC2/Packets";

export interface ISimClientStatusUpdate {
    status: string;
}

export interface ISimClient {
    on(event: "status", listener: (status: ISimClientStatusUpdate) => void): this;
    on(event: "stop", listener: () => void): this;
    on(event: "error", listener: (error: string) => void): this;
    on(event: "data", listener: (data: any) => void): this;
}

export interface ISimClientState {
    meta: Record<string, any>;
    values: Record<string, any>;
}

export default abstract class SimClient extends EventEmitter implements ISimClient {

    public abstract readonly game: string;

    public abstract state: ISimClientState;

    protected _isRunning = false;
    public get isRunning() {
        return this._isRunning;
    }

    public abstract get fields(): {
        meta: IType[];
        values: IType[];
    };

    protected options: any;

    constructor(options?: any) {
        super();
        this.options = options;
    }

    public abstract start(): void;
    public abstract stop(): void;

}
