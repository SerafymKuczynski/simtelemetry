import sqljs from "sql.js";
import * as fs from "fs";
import * as _ from "lodash";

import simClientManager from "../SimClients/SimClientManager";
import { ISimClientState } from "../SimClients/SimClient";
import { IType } from "../Games/PC2/Packets";

class STDatabase {

    private db?: sqljs.Database;

    public async loadFile(file: string): Promise<void> {
        const data = await new Promise<Buffer>((res, rej) => {
            fs.readFile(file, (err, d) => {
                if (err) { rej(err); } else { res(d); }
            });
        });
        this.db = new sqljs.Database(data);
    }

    public async saveFile(file: string): Promise<void> {
        if (!this.db) { return; }
        await new Promise<Buffer>((res, rej) => {
            fs.writeFile(file, this.db!.export(), (err) => {
                if (err) { rej(err); } else { res(); }
            });
        });
    }

    public startRecording() {
        if (!simClientManager.activeClient) { return; }

        this.db = new sqljs.Database();

        // TODO: Initialize tables
        console.log(this.generateFieldDefinitions(simClientManager.activeClient.fields.values));

        simClientManager.addListener("clientDataFrame", this.saveDataframe);
        // TODO
    }

    public stopRecording() {
        simClientManager.removeListener("clientDataFrame", this.saveDataframe);
    }

    private saveDataframe(state: ISimClientState) {
        // TODO
    }

    private generateFieldDefinitions(types: IType[], prefix = ""): string[] {
        return _.flatMap(types, (t) => {

            if (t.type.match(/array/)) {
                const result = /array (\d+)/.exec(t.type);
                if (!result) {
                    throw new Error("Invalid type definition: missing length of array in " + t.name);
                } else {
                    const length = Number.parseInt(result[1], 10);
                    let sqlTypes: string[] = [];
                    for (let i = 0; i < length; i++) {
                        const arrprefix = (prefix ? prefix + "_" : "") + i;
                        sqlTypes = sqlTypes.concat(this.getSqlTypes(t, arrprefix));
                    }
                    return sqlTypes;
                }
            } else {
                return this.getSqlTypes(t, prefix);
            }

        });
    }

    private getSqlTypes(td: IType, prefix: string): string[] {

        let sqlType;
        const type = td.type;

        if (type.match(/struct/)) {
            const structPrefix = (prefix ? prefix + "_" : "") + td.name;
            return this.generateFieldDefinitions(td.structType!, structPrefix);
        } else if (type.match(/int|short|char/)) {
            sqlType = "INTEGER";
        } else if (type.match(/(float|double)/)) {
            sqlType = "REAL";
        } else if (type.match(/string/)) {
            sqlType = "TEXT";
        } else {
            console.log("Invalid type:", type);
            sqlType = "NULL";
        }

        return [(prefix ? prefix + "_" : "") + td.name + " " + sqlType];

    }

}

export default new STDatabase();
