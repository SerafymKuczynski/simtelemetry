import { EventEmitter } from "events";
import * as fs from "fs";
import { promisify } from "util";
const writeFile = promisify(fs.write);
const openFile = promisify(fs.open);
const closeFile = promisify(fs.close);

export interface ISimClientStatusUpdate {
    status: string;
}

export interface ISimClient {
    on(event: "status", listener: (status: ISimClientStatusUpdate) => void): this;
    on(event: "stop", listener: () => void): this;
    on(event: "error", listener: (error: string) => void): this;
    on(event: "data", listener: (data: any) => void): this;
}

export default abstract class SimClient extends EventEmitter implements ISimClient {

    public abstract readonly game: string;

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

    public async saveToFile(path: string): Promise<void> {
        const fd = await openFile(path, "w");

        // write header
        const header = Buffer.alloc(16);
        header.write("str", 0, 3, "utf-8");
        header.writeUInt8(1, 3);
        header.write(this.game, 4, 4, "utf-8");
        header.writeUIntLE(Date.now(), 8, 8);
        this.writeToFile(fd, header);

        // write data
        await this.writeData(fd);

        await closeFile(fd);
    }

    protected async writeToFile(fd: number, data: Buffer) {
        return writeFile(fd, data);
    }

    protected abstract async writeData(fd: number): Promise<void>;

}
