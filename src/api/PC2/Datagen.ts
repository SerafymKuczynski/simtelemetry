import * as fs from "fs";
import * as path from "path";
import * as Packets from "./Packets";

function writeValue(typeDef: string, buffer: Buffer, position: number): number {
    if (typeDef.match(/unsigned int/)) {
        buffer.writeUInt32LE(Math.random() * Math.pow(2, 32), position);
        return position + 4;
    } else if (typeDef.match(/unsigned short/)) {
        buffer.writeUInt16LE(Math.random() * Math.pow(2, 16), position);
        return position + 2;
    } else if (typeDef.match(/unsigned char/)) {
        buffer.writeUInt8(Math.random() * 255, position);
        return position + 1;
    } else if (typeDef.match(/signed int/)) {
        buffer.writeInt32LE((Math.random() - 0.5) * Math.pow(2, 32), position);
        return position + 4;
    } else if (typeDef.match(/signed short/)) {
        buffer.writeInt16LE((Math.random() - 0.5) * Math.pow(2, 16), position);
        return position + 2;
    } else if (typeDef.match(/signed char/)) {
        buffer.writeInt8((Math.random() - 0.5) * 255, position);
        return position + 1;
    } else if (typeDef.match(/float/)) {
        buffer.writeFloatLE(Math.random() * 100, position);
        return position + 4;
    } else if (typeDef.match(/string/)) {
        // get string length
        const result = /string (\d+)/.exec(typeDef);
        if (!result) {
            throw new Error("Invalid type descriptor: String missing length in " + typeDef);
        } else {
            const length = Number.parseInt(result[1]);
            buffer.write("RandomString", position, length);
            return position + length;
        }
    } else {
        throw new Error("Unknown Type: " + typeDef);
    }
}

let pcounter = 0;
function createPacket(packetCategory: number): Buffer {
    const packetType = Packets.TypeInformations[packetCategory];
    const b = Buffer.alloc(packetType.size);
    b.writeUInt32LE(pcounter, 0);
    b.writeUInt32LE(pcounter++, 4);
    b.writeUInt8(1, 8);
    b.writeUInt8(1, 9);
    b.writeUInt8(packetCategory, 10);
    b.writeUInt8(6, 11);
    let position = 12;
    for (const t of packetType.td!) {
        if (t.type.match(/array/)) {
            const result = /array (\d+)/.exec(t.type);
            if (!result) {
                throw new Error("Invalid type definition: missing length of array in " + t);
            } else {
                const length = Number.parseInt(result[1]);
                for (let i = 0; i < length; i++) {
                    position = writeValue(t.type, b, position);
                }
            }
        } else {
            position = writeValue(t.type, b, position);
        }
    }
    return b;
}

const PACKET_COUNT = 100;
const file = path.resolve(__dirname, "testdata.str");
const fd = fs.openSync(file, "w");

const hb = Buffer.alloc(20);
hb.write("str");
hb.writeUInt8(1, 3);
hb.write("PC2", 4, 4);
hb.writeUIntLE(Date.now(), 8, 8);
hb.writeUInt32LE(PACKET_COUNT, 16);
fs.writeSync(fd, hb);

for (let i = 0; i < PACKET_COUNT; i++) {
    const b = createPacket(0);
    fs.writeSync(fd, b);
}
