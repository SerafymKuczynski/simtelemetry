<template>
    <div>
        <h1>Fuel: {{ fuel.toPrecision(2) }} Liter</h1>
        <h1>Last Lap: {{ fuelConsumedPerLap.toPrecision(2) }}</h1>
        <h1>Estimated Fuel per Lap: {{ estimatedFuelConsumedPerLap.toPrecision(2) }}</h1>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SimClientManager from "../SimClients/SimClientManager";
import { IPC2State } from "../Games/PC2/Interfaces";

@Component
export default class FuelMonitor extends Vue {

    currentFuel = 0;
    lastLap = -1;
    fuelAtBeginningOfLastLap = -1;
    fuelConsumedPerLap = 0;
    estimatedFuelConsumedPerLap = 0;

    mounted() {
        const scm = this.$store.state.scManager as SimClientManager;
        scm.subscribe(this, (df) => {
            this.$set(this, "currentFuel", df.values.FuelLevel * df.values.FuelCapacity);
            this.calculateFuelPerLap(df as IPC2State);
        });
    }

    beforeDestroy() {
        const scm = this.$store.state.scManager as SimClientManager;
        scm.unsubscribe(this);
    }

    private calculateFuelPerLap(state: IPC2State) {
        const values = state.values;
        const lpi = values.LocalParticipantIndex;
        const lap = values.Participants[lpi].CurrentLap
        const fuel = values.FuelLevel;
        if (lap !== this.lastLap && this.lastLap !== -1 && fuel > this.fuelAtBeginningOfLastLap) {
            this.fuelConsumedPerLap = (this.fuelAtBeginningOfLastLap - fuel) * values.FuelCapacity;
        } else {
            this.fuelConsumedPerLap = Number.NaN;
        }

        if (this.lastLap !== -1) {
            const lapPercentage = this // TODO
            this.estimatedFuelConsumedPerLap =
                (this.fuelAtBeginningOfLastLap - fuel) * (1 - values.Participants[lpi].CurrentLapDistance)
        }

        if (lap !== this.lastLap) {
            this.lastLap = lap;
            this.fuelAtBeginningOfLastLap = values.FuelLevel;
        }

    }

}
</script>
