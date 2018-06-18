function getValue(typeDef: string, buffer: Buffer, position: number): { newPosition: number, value: any } {

    let value: any;

    if (typeDef.match(/unsigned int/)) {
        value = buffer.readUInt32LE(position);
        position += 4;
    } else if (typeDef.match(/unsigned short/)) {
        value = buffer.readUInt16LE(position);
        position += 2;
    } else if (typeDef.match(/unsigned char/)) {
        value = buffer.readUInt8(position);
        position++;
    } else if (typeDef.match(/signed int/)) {
        value = buffer.readInt32LE(position);
        position += 4;
    } else if (typeDef.match(/signed short/)) {
        value = buffer.readInt16LE(position);
        position += 2;
    } else if (typeDef.match(/signed char/)) {
        value = buffer.readInt8(position);
        position++;
    } else if (typeDef.match(/float/)) {
        value = buffer.readFloatLE(position);
        position += 4;
    } else if (typeDef.match(/string/)) {
        // get string length
        const result = /string (\d+)/.exec(typeDef);
        if (!result) {
            throw new Error("Invalid type descriptor: String missing length in " + typeDef);
        } else {
            const length = Number.parseInt(result[1]);
            buffer.toString("utf-8", position, position + length).replace(/\0/g, "");
            position += length;
        }
    } else {
        console.log("Unsupported type:", typeDef);
    }

    return {
        newPosition: position,
        value
    };

}

export interface IParsedMessage {
    positionInBuffer: number;
    messageObject: any;
}

export interface ITypeDefinition {
    name: string;
    type: string;
}

export function parseMessage(
    buffer: Buffer, typeDefinitions: ITypeDefinition[], initialPosition = 0): IParsedMessage {

    let position = initialPosition;
    const retobj: { [name: string]: any } = {};

    for (const td of typeDefinitions) {

        const typeDef = td.type.trim();
        let value: any;

        if (typeDef.match(/array/)) {
            const result = /array (\d+)/.exec(typeDef);
            if (!result) {
                throw new Error("Invalid type definition: missing length of array in " + typeDef);
            } else {
                const length = Number.parseInt(result[1]);
                const arr = [];
                for (let i = 0; i < length; i++) {
                    const tmp = getValue(typeDef, buffer, position);
                    position = tmp.newPosition;
                    arr.push(tmp.value);
                }
                value = arr;
            }
        } else {
            const tmp = getValue(typeDef, buffer, position);
            position = tmp.newPosition;
            value = tmp.value;
        }

        retobj[td.name] = value;

    }

    return { positionInBuffer: position, messageObject: retobj };
}
