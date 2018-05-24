import { createSocket, RemoteInfo, Socket } from "dgram";
import SimClient from "../SimClient";
import * as Api from "./Api/Definitions";
import { parseMessage } from "./Api/MessageParser";

export default class PC2Receiver extends SimClient {

    private readonly SMS_UDP_PORT = 5606;
    private readonly SMS_UDP_MAX_PACKETSIZE = 1500;

    private readonly udp: Socket = createSocket("udp4");

    private messageCounter = 0;

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
            this.emit("status", `Receives ${this.messageCounter} packets.`);
            const cpm = parseMessage(msg, Api.TelemetryDataTypes, hpm.positionInBuffer);
            const tm = cpm.messageObject as Api.ITelemetryData;
            console.log(tm.EngineSpeed);
        }

    }

}
