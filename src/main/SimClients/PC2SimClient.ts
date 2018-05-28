import { createSocket, RemoteInfo, Socket } from "dgram";
import * as fs from "fs";

import * as Api from "../../api/PC2/Definitions";
import { parseMessage } from "../../api/PC2/MessageParser";
import SimClient from "./SimClient";

export default class PC2SimClient extends SimClient {

    public readonly game = "PC2";

    private readonly SMS_UDP_PORT = 5606;
    // private readonly SMS_UDP_MAX_PACKETSIZE = 1500;
    private readonly udp: Socket = createSocket("udp4");

    private messageCounter = 0;
    private dataPoints: Buffer[] = [];

    constructor() {
        super();
        // this.udp.setRecvBufferSize(this.SMS_UDP_MAX_PACKETSIZE);
        this.udp.on("message", (b, i) => this.parseMessage(b, i));
    }

    public start(): void {
        this._isRunning = true;
        this.udp.bind(this.SMS_UDP_PORT);
    }

    public stop(): void {
        this._isRunning = false;
        this.udp.close();
        this.emit("stop");
    }

    protected writeData(ws: fs.WriteStream) {

        // write PC2 specific header
        const b = Buffer.alloc(16);
        b.writeUInt32LE(this.dataPoints.length, 0);
        ws.write(b);

        // write data packets
        for (const dbuff of this.dataPoints) {
            ws.write(dbuff);
        }

    }

    private parseMessage(msg: Buffer, rinfo: RemoteInfo): void {
        if (!this.isRunning) { return; }

        // get message header
        const hpm = parseMessage(msg, Api.PacketBaseTypes);
        const header = hpm.messageObject as Api.IPacketBase;

        if (header.PartialPacketNumber > 1) {
            console.log("not supporting partial packets yet.");
            return;
        }

        if (header.PacketType === Api.PacketTypes.CarPhysics) {
            this.messageCounter++;
            this.emit("status", `Received ${this.messageCounter} packets.`);
            const size = Api.PacketTypeInformations[header.PacketType].size;
            const b = Buffer.allocUnsafe(size);
            msg.copy(b, 0, 0, size);
            this.dataPoints.push(b);
        }

    }

}
