export interface IDataPoint {
    tick: number;
    value: number;
}

export interface IRawDataSeries {
    id: number;
    data: IDataPoint[];
}
