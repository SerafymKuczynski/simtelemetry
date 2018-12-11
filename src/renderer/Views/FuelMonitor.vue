<template>
    <div style="width:100%;">
        <v-container fluid grid-list-xl>
            <v-layout row wrap>

                <v-flex xs4>
                    <v-card style="text-align: center;">
                        <v-card-text>
                            <div class="title font-weight-light mb-2">Fuel</div>
                            <h1 class="font-weight-regular">{{ currentFuel.toFixed(2) }} liters</h1>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex xs4>
                    <v-card style="text-align: center;">
                        <v-card-text>
                            <div class="title font-weight-light mb-2">Last Lap</div>
                            <h1 class="font-weight-regular">{{ fuelConsumedPerLap.toFixed(2) }} liters</h1>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex xs4>
                    <v-card style="text-align: center;">
                        <v-card-text>
                            <div class="title font-weight-light mb-2">Estimated Fuel per Lap</div>
                            <h1 class="font-weight-regular">{{ estimatedFuelConsumedPerLap.toFixed(2) }} liters</h1>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-divider></v-divider>

                <v-flex xs12>
                    <v-card>
                        <v-card-title primary-title>
                            <div class="headline">Strategy</div>
                        </v-card-title>
                        <v-card-text>
                            <!-- TODO: Strategy suggestions -->
                        </v-card-text>
                    </v-card>
                </v-flex>

            </v-layout>
        </v-container>
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
        const p = values.Participants[values.LocalParticipantIndex];
        const lap = p.CurrentLap
        const fuel = values.FuelLevel;
        if (lap !== this.lastLap && this.lastLap !== -1) {
            this.fuelConsumedPerLap = (this.fuelAtBeginningOfLastLap - fuel) * values.FuelCapacity;
        }

        if (this.lastLap !== -1) {
            const lapPercentage = p.CurrentLapDistance / state.meta.TrackLength;
            this.estimatedFuelConsumedPerLap =
                (this.fuelAtBeginningOfLastLap - fuel) * (1 / lapPercentage) * values.FuelCapacity;
        }

        if (lap !== this.lastLap) {
            this.lastLap = lap;
            this.fuelAtBeginningOfLastLap = values.FuelLevel;
        }

    }

}
</script>
