import { createSocket, RemoteInfo, Socket } from "dgram";

import * as Interfaces from "../Games/PC2/Interfaces";
import parseMessage from "../Games/PC2/MessageParser";
import * as Packets from "../Games/PC2/Packets";
import SimClient from "./SimClient";

export default class PC2SimClient extends SimClient {

    public readonly game = "PC2";

    public state = {
        meta: {},
        values: {}
    };

    public get fields() {
        return {
            meta: [],
            values: Packets.TelemetryDataTypes.concat(Packets.TimingsDataDataTypes)
        };
    }

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
        this.emit("status", "Waiting for connection...");
    }

    public stop(): void {
        this._isRunning = false;
        this.udp.close();
        this.emit("stop");
    }

    private parseMessage(msg: Buffer, rinfo: RemoteInfo): void {
        if (!this.isRunning) { return; }

        // get message header
        const hpm = parseMessage(msg, Packets.BaseTypes);
        const header = hpm.messageObject as Interfaces.IPacketBase;

        if (header.PartialPacketNumber > 1) {
            console.log("not supporting partial packets yet.");
            return;
        }

        if (header.PacketType === Packets.Categories.CarPhysics) {
            this.messageCounter++;
            this.emit("status", `Received ${this.messageCounter} packets.`);
            const size = Packets.TypeInformations[header.PacketType].size;
            const b = Buffer.allocUnsafe(size);
            msg.copy(b, 0, 0, size);
            this.dataPoints.push(b);
        }

    }

}
