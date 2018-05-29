<template>
    <svg>
        <g-line :data="data"></g-line>
    </svg>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import GLine from "@/Components/RawGraph/Line.vue";
import { DPManagerInstance } from "../Data/LoadFile";
import DataProvider from "../Data/DataProvider";
import PC2DataProvider from "../Data/PC2DataProvider";

@Component({
    components: { 'g-line': GLine }
})
export default class RawGraph extends Vue {

    public data = [ 1, 2, 3, 10, 50 ];

    private async updateData() {

        const tempDp = DPManagerInstance.dp as DataProvider|undefined;
        if (!tempDp || tempDp.game !== "PC2") { return; }

        const dp = tempDp as PC2DataProvider;
        const pcount = dp.telemetryDataPacketCount;
        const newData = [];
        for (let i = 0; i < pcount; i++) {
            const packet = await dp.getTelemetryDataPacket(i);
            newData.push(packet.EngineSpeed);
        }
        this.data = newData;

    }

    mounted() {
        DPManagerInstance.on("dpChanged", () => this.updateData());
        if (DPManagerInstance.dp) { this.updateData(); }
    }

}

const pc2dataSeries = [
    { name: "Unfiltered Throttle", property: "UnfilteredThrottle" },
    { name: "Unfiltered Brake", property: "UnfilteredBrake" },
    { name: "Unfiltered Steering", property: "UnfilteredSteering" },
    { name: "Unfiltered Clutch", property: "UnfilteredClutch" },
    { name: "Oil Temperature", property: "OilTempCelsius", unit: "deg C" },
    { name: "Oil Pressure", property: "OilPressureKPa", unit: "KPa" },
    { name: "Water Temperature", property: "WaterTempCelsius", unit: "deg C" },
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
    // TODO
]
</script>

<style>

</style>
