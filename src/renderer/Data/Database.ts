import sqljs from "sql.js";
import * as fs from "fs";
import _ from "lodash";

import { ISimClientState } from "../SimClients/type";
import SimClientManager from "../SimClients/SimClientManager";
import { IType } from "../SimClients/type";

export default class STDatabase {

    public db?: sqljs.Database;
    public isRecording = false;
    private counter = 0;
    private scmanager: SimClientManager;

    public constructor(scmanager: SimClientManager) {
        this.scmanager = scmanager;
    }

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
        if (!this.scmanager.activeClient) { return; }
        this.db = new sqljs.Database();
        const fd = this.generateFieldDefinitions(this.scmanager.activeClient.fields.values);
        this.db.run(`CREATE TABLE frames (frameIndex INTEGER PRIMARY KEY, ${fd.join(", ")});`);
        this.scmanager.subscribe(this, (s) => { this.saveDataframe(s); });
        this.isRecording = true;
    }

    public stopRecording() {
        this.scmanager.unsubscribe(this);
        this.isRecording = false;
    }

    private saveDataframe(state: ISimClientState) {
        if (!this.scmanager.activeClient || !this.db || _.isEmpty(state.values)) { return; }
        const fv = this.getFrameValues(this.scmanager.activeClient.fields.values, state.values);
        this.db.run(`INSERT INTO frames VALUES (${this.counter++}, ${fv.join(", ")});`);
    }

    private generateFieldDefinitions(types: IType[], prefix: string[] = []): string[] {
        return _.flatMap(types, (t) => {

            if (t.type.match(/array/)) {
                const result = /array (\d+)/.exec(t.type);
                if (!result) {
                    throw new Error("Invalid type definition: missing length of array in " + t.name);
                } else {
                    const length = Number.parseInt(result[1], 10);
                    let sqlTypes: string[] = [];
                    for (let i = 0; i < length; i++) {
                        const newT: IType = {
                            name: "",
                            type: t.type,
                            structType: t.structType
                        };
                        sqlTypes = sqlTypes.concat(this.getSqlTypes(newT, prefix.concat([ t.name, i.toString() ])));
                    }
                    return sqlTypes;
                }
            } else {
                return this.getSqlTypes(t, prefix);
            }

        });
    }

    private getSqlTypes(td: IType, prefix: string[] = []): string[] {

        let sqlType;
        const type = td.type;

        if (type.match(/struct/)) {
            return this.generateFieldDefinitions(td.structType!, prefix.concat(td.name));
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

        const columnName = prefix.concat(td.name).filter((s) => !!s).join("_");
        return [`${columnName} ${sqlType}`];

    }

    private getFrameValues(types: IType[], obj: Record<string, any>): string[] {
        return _.flatMap(types, (t) => {
            if (t.type.match(/array/)) {
                const result = /array (\d+)/.exec(t.type);
                if (!result) {
                    throw new Error("Invalid type definition: missing length of array in " + t.name);
                } else {
                    const length = Number.parseInt(result[1], 10);
                    let values: string[] = [];
                    for (let i = 0; i < length; i++) {
                        values = values.concat(
                            this.getFrameValue(t, obj && obj[t.name] || undefined, i)
                        );
                    }
                    return values;
                }
            } else {
                return this.getFrameValue(t, obj);
            }
        });
    }

    private getFrameValue(t: IType, obj?: Record<string, any>, index = -1): string[] {
        const o = ((index > -1) ? (obj && obj[index]) : (obj && obj[t.name])) || undefined;
        if (t.type.match(/struct/)) {
            return this.getFrameValues(t.structType!, o || {});
        } else if (t.type.match(/int|short|char|float|double/)) {
            const value = o || 0;
            return [value.toString()];
        } else {
            return ['"' + (o || "").replace('"', '\\"') + '"'];
        }
    }

}
