import { createSocket, RemoteInfo, Socket } from "dgram";

import * as Interfaces from "./Interfaces";
import parseMessage from "./MessageParser";
import * as Packets from "./Packets";
import SimClient from "../../SimClients/SimClient";

const valuePackets = [ 0, 3 ];

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
    private readonly TIMEOUT = 100;
    // private readonly SMS_UDP_MAX_PACKETSIZE = 1500;
    private readonly udp: Socket = createSocket("udp4");

    private messageCounter = 0;
    private timeoutInstance?: any;

    constructor() {
        super();
        // this.udp.setRecvBufferSize(this.SMS_UDP_MAX_PACKETSIZE);
        this.udp.on("message", (b, i) => this.parseMessage(b, i));
    }

    public start(): void {
        this.isRunning = true;
        this.udp.bind(this.SMS_UDP_PORT);
        this.status = "Waiting for connection...";
    }

    public stop(): void {
        this.isRunning = false;
        this.udp.close();
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

        this.status = `Received ${++this.messageCounter} packets.`;

        this.gameIsActive = true;
        if (this.timeoutInstance) {
            clearTimeout(this.timeoutInstance);
        }
        this.timeoutInstance = setTimeout(() => {
            this.gameIsActive = false;
        }, this.TIMEOUT);

        const td = Packets.TypeInformations[header.PacketType].td;
        if (td) {
            const value = parseMessage(msg, td, Packets.HeaderSize).messageObject;
            if (valuePackets.includes(header.PacketType)) {
                Object.assign(this.state.values, value);
            }
        }

    }

}
