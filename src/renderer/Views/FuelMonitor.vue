<template>
    <div>
        <h1>Fuel: {{ fuel.toPrecision(2) }} Liter</h1>
        <h1>Last Lap: {{ fuelConsumedPerLap.toPrecision(2) }}</h1>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SimClientManager from "../SimClients/SimClientManager";
import { IPC2GameState } from "../Games/PC2/Interfaces";

@Component
export default class FuelMonitor extends Vue {

    currentFuel = 0;
    lastLap = -1;
    fuelAtBeginningOfLastLap = -1;
    fuelConsumedPerLap = 0;

    mounted() {
        const scm = this.$store.state.scManager as SimClientManager;
        scm.subscribe(this, (df) => {
            this.$set(this, "currentFuel", df.values.FuelLevel * df.values.FuelCapacity);
            this.calculateFuelPerLap(df.values as IPC2GameState);
        });
    }

    beforeDestroy() {
        const scm = this.$store.state.scManager as SimClientManager;
        scm.unsubscribe(this);
    }

    private calculateFuelPerLap(values: IPC2GameState) {
        const lpi = values.LocalParticipantIndex;
        const lap = values.Participants[lpi].CurrentLap
        const fuel = values.FuelLevel;
        if (lap !== this.lastLap && this.lastLap !== -1 && fuel > this.fuelAtBeginningOfLastLap) {
            this.fuelConsumedPerLap = (this.fuelAtBeginningOfLastLap - fuel) * values.FuelCapacity;
        } else {
            this.fuelConsumedPerLap = Number.NaN;
        }

        if (lap !== this.lastLap) {
            this.lastLap = lap;
            this.fuelAtBeginningOfLastLap = values.FuelLevel;
        }

    }

}
</script>
