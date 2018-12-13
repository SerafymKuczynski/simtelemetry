<template>
    <div class="fill-height" style="width: 100%;">
        <div v-if="db" class="fill-height" style="width: 100%;">

            <canvas ref="canvas"></canvas>

            <v-navigation-drawer app clipped right permanent>
                <v-list>
                    <template v-for="(series, index) in dataSeries">

                        <v-list-tile v-if="!series.subSeries" :key="index" @click="onSeriesActiveChanged(series)">
                            <v-list-tile-action>
                                <v-checkbox
                                    :value="series.isActive"
                                    readonly>
                                </v-checkbox>
                            </v-list-tile-action>
                            <v-list-tile-content>
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
                                <v-list-tile @click="onSeriesActiveChanged(subSeries)">
                                    <v-list-tile-action>
                                        <v-checkbox :value="subSeries.isActive">
                                        </v-checkbox>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        <v-list-tile-title>{{ series.name + " " + subSeries.name }}</v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list-tile>
                        </v-list-group>

                    </template>
                </v-list>
            </v-navigation-drawer>
        </div>

        <v-alert v-else :value="true" type="info">Please load a file first.</v-alert>

    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Database } from "sql.js";
import Chart from "chart.js";

interface IDataSeries {
    name: string;
    f?: (x: number) => number;
    dsIndex?: number;
    property?: string;
    unit?: string;
    subSeries?: IDataSeries[];
    parentSeries?: IDataSeries;
    isActive?: boolean;
}

@Component
export default class RawGraph extends Vue {

    private chart!: Chart;

    public dataSeries: IDataSeries[] = pc2dataSeries.map((x) => {
        if (x.subSeries) {
            x.subSeries = x.subSeries.map((y, j) => Object.assign({ isActive: false, parentSeries: x }, y));
            return Object.assign({ isExtended: false }, x);
        } else {
            return Object.assign({ isActive: false, dsIndex: -1 }, x);
        }
    }) as IDataSeries[];

    get db() {
        return this.$store.state.database.db as Database;
    }

    private async addSeries(series: IDataSeries) {

        if (!this.db) { return; }

        let columnName;
        let label;
        if (series.parentSeries) {
            const ps = series.parentSeries;
            const i = ps.subSeries!.indexOf(series);
            columnName = ps.property + "_" + [i];
            label = ps.name + " " + series.name;
        } else {
            columnName = series.property;
            label = series.name;
        }

        const data = this.db.exec(`SELECT ${columnName} FROM frames;`);
        let values = data[0].values.map((v) => v[0] as number);
        if (series.f) {
            values = values.map(series.f);
        }
        this.chart.data.datasets!.push({
            label: label,
            borderColor: "#ff3333",
            pointRadius: 0,
            pointHitRadius: 4,
            data: values.map((v, i) => ({ x: i, y: v }))
        });
        series.dsIndex = this.chart.data.datasets!.length - 1;
        this.chart.update();
        
    }

    onSeriesActiveChanged(series: IDataSeries) {
        series.isActive = !series.isActive;
        if (series.isActive) {
            this.addSeries(series);
        } else {
            this.chart.data.datasets!.splice(series.dsIndex!);
            series.dsIndex = -1;
            this.chart.update();
        }
    }

    mounted() {
        const el = this.$refs.canvas as HTMLCanvasElement;
        this.chart = new Chart(el, {
            type: "line",
            data: {
                datasets: []
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom'
                    }],
                    yAxes: [{
                        type: "linear",
                        position: "left"
                    }]
                }
            }
        })
    }

}

const pc2VectorSubSeries = [
    { name: "X" },
    { name: "Y" },
    { name: "Z" }
];
const pc2TyreSubSeries = [
    { name: "FL" },
    { name: "FR" },
    { name: "RL" },
    { name: "RR" }
];
const pc2dataSeries: IDataSeries[] = [
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
    { name: "Gear", property: "GearNumGears", f: (g) => {
        let gear = (g & 0x0F);
        if (gear >= 8) {
            gear = -(~(gear - 1) & 0x0F);
        }
        return gear;
    } },
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
