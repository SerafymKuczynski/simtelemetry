import * as Interfaces from "../../api/PC2/Interfaces";
import { parseMessage } from "../../api/PC2/MessageParser";
import * as Packets from "../../api/PC2/Packets";
import DataProvider from "./DataProvider";

interface IPC2DataPacket {
    position: number;
    type: number;
}

export default class PC2DataProvider extends DataProvider {

    public readonly game = "PC2";

    private fileIndex: IPC2DataPacket[] = [];

    get packetCount() {
        return this.fileIndex.length;
    }

    get telemetryDataPacketCount() {
        return this.fileIndex.filter((x) => x.type === Packets.Categories.CarPhysics).length;
    }

    public getPacket(index: number): Promise<any> {
        const fi = this.fileIndex[index];
        return this.getPacketInternal(fi.position, fi.type);
    }

    public getTelemetryDataPacket(index: number): Promise<Interfaces.ITelemetryData> {
        const fi = this.fileIndex.filter((x) => x.type === Packets.Categories.CarPhysics)[index];
        return this.getPacketInternal(fi.position, fi.type);
    }

    protected async loadData() {

        let position = this.HEADER_SIZE;

        // read total number of packets
        const packetCountBuffer = Buffer.alloc(4);
        await this.readFromFile(packetCountBuffer, 4, position);
        const packetCount = packetCountBuffer.readUInt32LE(0);
        position += 4;

        const packetHeaderBuffer = Buffer.alloc(Packets.HeaderSize);
        for (let i = 0; i < packetCount; i++) {
            await this.readFromFile(packetHeaderBuffer, Packets.HeaderSize, position);
            position += Packets.HeaderSize;
            const packetHeader = parseMessage(packetHeaderBuffer, Packets.BaseTypes);
            const ptype = (packetHeader.messageObject as Interfaces.IPacketBase).PacketType;
            if (ptype < 0 || ptype >= Packets.TypeInformations.length) {
                throw Error(`Invalid packet type: ${ptype} (Index: ${i})`);
            }
            this.fileIndex.push({ position, type: ptype });
            position += Packets.TypeInformations[ptype].size - Packets.HeaderSize;
        }

    }

    private async getPacketInternal(position: number, pt: number): Promise<any> {
        const size = Packets.TypeInformations[pt].size - Packets.HeaderSize;
        const buff = Buffer.alloc(size);
        await this.readFromFile(buff, size, position);
        const parsedMessage = parseMessage(buff, Packets.TypeInformations[pt].td!);
        return parsedMessage.messageObject;
    }

}
