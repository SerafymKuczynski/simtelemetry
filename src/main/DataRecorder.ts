import fs from "fs";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

export interface IDataPoint {
    timestamp: Date;
    data: any;
}

export interface IMetadata {
    recordStart: Date;
    recordEnd: Date;
    customName: string;
    dataPointCount: number;
}

export default class DataRecorder {

    private dataPoints: IDataPoint[] = [];

    public savePoint(data: any): void {
        this.dataPoints.push({
            timestamp: new Date(),
            data
        });
    }

    public async saveToFile(path: string): Promise<void> {
        if (this.dataPoints.length === 0) {
            throw new Error("Not saving file without data points.");
        }
        writeFile(path, {
            metadata: {
                customName: "",
                recordStart: this.dataPoints[0].timestamp,
                recordEnd: this.dataPoints[this.dataPoints.length - 1].timestamp,
                dataPointCount: this.dataPoints.length
            } as IMetadata,
            dataPoints: this.dataPoints
        });
    }

}
