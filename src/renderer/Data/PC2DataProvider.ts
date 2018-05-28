import * as Api from "../../api/PC2/Definitions";
import { parseMessage } from "../../api/PC2/MessageParser";
import DataProvider from "./DataProvider";

interface IPC2DataPacket {
    position: number;
    type: number;
}

export default class PC2DataInstance extends DataProvider {

    public readonly game = "PC2";

    private fileIndex: IPC2DataPacket[] = [];

    get packetCount() {
        return this.fileIndex.length;
    }

    get telemetryDataPacketCount() {
        return this.fileIndex.filter((x) => x.type === Api.PacketTypes.CarPhysics).length;
    }

    public getPacket(index: number): Promise<any> {
        const fi = this.fileIndex[index];
        return this.getPacketInternal(fi.position, fi.type);
    }

    public getTelemetryDataPacket(index: number): Promise<Api.ITelemetryData> {
        const fi = this.fileIndex.filter((x) => x.type === Api.PacketTypes.CarPhysics)[index];
        return this.getPacketInternal(fi.position, fi.type);
    }

    protected async loadData() {

        let position = this.HEADER_SIZE;

        // read total number of packets
        const packetCountBuffer = Buffer.alloc(4);
        await this.readFromFile(packetCountBuffer, 4, position);
        const packetCount = packetCountBuffer.readUInt32LE(0);
        position += 4;

        const packetHeaderBuffer = Buffer.alloc(Api.PacketHeaderSize);
        console.log(`Packet Count: ${packetCount}`);
        for (let i = 0; i < packetCount; i++) {
            console.log("Position", position);
            await this.readFromFile(packetHeaderBuffer, Api.PacketHeaderSize, position);
            position += Api.PacketHeaderSize;
            const packetHeader = parseMessage(packetHeaderBuffer, Api.PacketBaseTypes);
            const ptype = (packetHeader.messageObject as Api.IPacketBase).PacketType;
            if (ptype < 0 || ptype >= Api.PacketTypeInformations.length) {
                throw Error(`Invalid packet type: ${ptype} (Index: ${i})`);
            }
            this.fileIndex.push({ position, type: ptype });
            position += Api.PacketTypeInformations[ptype].size - Api.PacketHeaderSize;
        }

    }

    private async getPacketInternal(position: number, pt: number): Promise<any> {
        const size = Api.PacketTypeInformations[pt].size - Api.PacketHeaderSize;
        const buff = Buffer.alloc(size);
        await this.readFromFile(buff, size, position);
        parseMessage(buff, Api.PacketTypeInformations[pt].td!);
    }

}
