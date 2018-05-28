import * as fs from "fs";
import { promisify } from "util";
const read = promisify(fs.read);

export default abstract class DataProvider {

    public abstract readonly game: string;
    protected readonly HEADER_SIZE = 16;
    private fd: number;

    private _timestamp?: Date;
    public get timestamp() { return this._timestamp; }

    constructor(fd: number) {
        this.fd = fd;
    }

    public async loadFile(): Promise<void> {
        // load metadata
        const metadataBuffer = Buffer.alloc(8);
        await this.readFromFile(metadataBuffer, 8, 8);
        this._timestamp = new Date(metadataBuffer.readUIntLE(0, 8));

        // load game specific data
        await this.loadData();
    }

    public close(): Promise<void> {
        if (!this.fd) { throw Error("File not opened"); }
        return new Promise((res, rej) => {
            fs.close(this.fd!, (err) => {
                if (err) { rej(err); } else { res(); }
            });
        });
    }

    protected abstract async loadData(): Promise<void>;

    protected async readFromFile(buffer: Buffer, length: number, position: number) {
        if (!this.fd) { throw Error("File not opened"); }
        return read(this.fd, buffer, 0, length, position);
    }

}
