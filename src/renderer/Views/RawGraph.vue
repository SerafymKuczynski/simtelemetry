<template>
    <div>
        <svg>
            <g-line v-for="series in rawData" :key="series.id" :data="series.data"></g-line>
        </svg>
        <v-navigation-drawer app clipped right permanent>
            <v-list>
                <template v-for="(series, index) in dataSeries">

                    <v-list-tile v-if="!series.subSeries" :key="index" href="javascript:;">
                        <v-list-tile-action>
                            <v-checkbox
                                v-model="series.isActive"
                                readonly
                                @click.native="onSeriesActiveChanged(series)">
                            </v-checkbox>
                        </v-list-tile-action>
                        <v-list-tile-content @click="onSeriesActiveChanged(series)">
                            <v-list-tile-title>{{ series.name }}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-group v-else :key="index" v-model="series.isExtended">
                        <v-list-tile slot="activator">
                            <v-list-tile-content>
                                <v-list-tile-title>{{ series.name }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile v-for="subSeries in series.subSeries" :key="subSeries.name">
                            <v-list-tile href="javascript:;">
                                <v-list-tile-action>
                                    <v-checkbox v-model="subSeries.isActive">
                                    </v-checkbox>
                                </v-list-tile-action>
                                <v-list-tile-content @click="subSeries.isActive = !subSeries.isActive">
                                    <v-list-tile-title>{{ series.name + " " + subSeries.name }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-tile>
                    </v-list-group>

                </template>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import GLine from "@/Components/RawGraph/Line.vue";
import { DPManagerInstance } from "../Data/LoadFile";
import DataProvider from "../Data/DataProvider";
import PC2DataProvider from "../Data/PC2DataProvider";

interface IDataSeries {
    id: number;
    name: string;
    property?: string;
    unit?: string;
    subSeries?: IDataSeries[];
    isActive?: boolean;
    f?: (d: number|number[]) => number;
}

interface IRawDataSeries {
    id: number;
    data: number[];
}

@Component({
    components: { "g-line": GLine }
})
export default class RawGraph extends Vue {

    public rawData: IRawDataSeries[] = [];

    public dataSeries: IDataSeries[] = pc2dataSeries.map((x,i) => {
        if (x.subSeries) {
            x.subSeries = x.subSeries.map((y, j) => Object.assign({ isActive: false, id: i * 1000 + j }, y));
            return Object.assign({ isExtended: false }, x);
        } else {
            return Object.assign({ isActive: false, id: i }, x);
        }
    }) as IDataSeries[];

    private async addSeries(seriesId: number): Promise<void> {

        const tempDp = DPManagerInstance.dp as DataProvider | undefined;
        if (!tempDp || tempDp.game !== "PC2") {
            return;
        }
        const dp = tempDp as PC2DataProvider;

        let parentSeries = seriesId;
        if (seriesId >= 1000) {
            parentSeries = (seriesId - (seriesId % 1000)) / 1000;
        }

        const ps = this.dataSeries.find((x) => x.id === parentSeries)!;
        let f: (d: number|number[]) => number;
        if (seriesId !== parentSeries) {
            f = ps.subSeries!.find((x) => x.id === seriesId)!.f!;
        } else {
            f = (d: number|number[]) => d as number;
        }
        
        const pcount = dp.telemetryDataPacketCount;
        const data = [];
        for (let i = 0; i < pcount; i++) {
            const packet = (await dp.getTelemetryDataPacket(i) as any) as { [p: string]: number|number[] };
            data.push(f(packet[ps.property!]));
        }

        this.rawData.push({
            id: seriesId,
            data
        });
        
    }

    onSeriesActiveChanged(series: IDataSeries) {
        series.isActive = !series.isActive;
        if (series.isActive) {
            this.addSeries(series.id);
        } else {
            this.rawData.splice(this.rawData.findIndex((x) => x.id === series.id), 1);
        }
    }

    mounted() {
        /*DPManagerInstance.on("dpChanged", () => this.updateData());
        if (DPManagerInstance.dp) {
            this.updateData();
        }*/
    }
}

const pc2VectorSubSeries = [
    { name: "X", f: (d: number[]) => d[0] },
    { name: "Y", f: (d: number[]) => d[1] },
    { name: "Z", f: (d: number[]) => d[2] }
];
const pc2TyreSubSeries = [
    { name: "FL", f: (d: number[]) => d[0] },
    { name: "FR", f: (d: number[]) => d[1] },
    { name: "RL", f: (d: number[]) => d[2] },
    { name: "RR", f: (d: number[]) => d[3] }
];
const pc2dataSeries = [
    { name: "Unfiltered Throttle", property: "UnfilteredThrottle" },
    { name: "Unfiltered Brake", property: "UnfilteredBrake" },
    { name: "Unfiltered Steering", property: "UnfilteredSteering" },
    { name: "Unfiltered Clutch", property: "UnfilteredClutch" },
    { name: "Oil Temperature", property: "OilTempCelsius", unit: "°C" },
    { name: "Oil Pressure", property: "OilPressureKPa", unit: "KPa" },
    { name: "Water Temperature", property: "WaterTempCelsius", unit: "°C" },
    { name: "Water Pressure", property: "WaterPressureKpa", unit: "KPa" },
    { name: "Fuel Pressure", property: "FuelPressureKpa", unit: "KPa" },
    { name: "Brake", property: "Brake" },
    { name: "Throttle", property: "Throttle" },
    { name: "Clutch", property: "Clutch" },
    { name: "Fuel Level", property: "FuelLevel" },
    { name: "Speed", property: "Speed" },
    { name: "RPM", property: "Rpm" },
    { name: "Steering", property: "Steering" },
    { name: "Gear", property: "GearNumGears" },
    { name: "Boost", property: "BoostAmount" },
    { name: "Crash State", property: "CrashState" },
    { name: "Odometer", property: "OdometerKM", unit: "km" },
    { name: "Local Velocity", property: "LocalVelocity", subSeries: pc2VectorSubSeries },
    { name: "Local Acceleration", property: "LocalAcceleration", subSeries: pc2VectorSubSeries },
    { name: "Tyre RPS", property: "TyreRPS", subSeries: pc2TyreSubSeries },
    { name: "Tyre Temperature", property: "TyreTemp", subSeries: pc2TyreSubSeries },
    { name: "Tyre Wear", property: "TyreWear", subSeries: pc2TyreSubSeries },
    { name: "Brake Temperature", property: "BrakeTempCelsius", unit: "°C", subSeries: pc2TyreSubSeries },
    { name: "Suspension Travel", property: "SuspensionTravel", subSeries: pc2TyreSubSeries },
    { name: "Tyre Pressure", property: "AirPressure", subSeries: pc2TyreSubSeries },
    { name: "Engine Speed", property: "EngineSpeed" },
    { name: "Engine Torque", property: "EngineTorque" },
    { name: "Turbo Boost Pressure", property: "TurboBoostPressure" },
    { name: "Brake Bias", property: "BrakeBias" }
];
</script>

<style>
</style>
