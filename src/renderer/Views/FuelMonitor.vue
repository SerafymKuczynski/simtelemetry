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
                            <c-timeline
                                class="mb-3"
                                :currentLap="currentLap"
                                :totalLaps="totalLaps"
                                :stops="stops"
                            ></c-timeline>
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
import Timeline from "@/Components/Fuel/Timeline.vue";

@Component({
    components: {
        'c-timeline': Timeline
    }
})
export default class FuelMonitor extends Vue {

    currentFuel = 0;
    lastLap = -1;
    fuelAtBeginningOfLastLap = -1;
    fuelConsumedPerLap = 0;
    estimatedFuelConsumedPerLap = 0;
    lapHistory: number[] = [];

    totalLaps = 60;
    currentLap = 0;
    stops = [ 15, 30, 45 ];

    mounted() {
        const scm = this.$store.state.scManager as SimClientManager;
        scm.subscribe(this, (df) => {
            this.$set(this, "currentFuel", df.values.FuelLevel * df.values.FuelCapacity);
            this.calculate(df as IPC2State);
        });
    }

    beforeDestroy() {
        const scm = this.$store.state.scManager as SimClientManager;
        scm.unsubscribe(this);
    }

    private calculate(state: IPC2State) {
        const { TrackLength, LapsTimeInEvent } = state.meta;
        const { FuelLevel, FuelCapacity, Participants, LocalParticipantIndex } = state.values;
        const p = Participants[LocalParticipantIndex];
        const { CurrentLap, CurrentLapDistance } = p;
        this.currentLap = p.CurrentLap;

        // Fuel consumption
        if (this.currentLap !== this.lastLap && this.lastLap !== -1) {
            this.fuelConsumedPerLap = (this.fuelAtBeginningOfLastLap - FuelLevel) * FuelCapacity;
            this.lapHistory.push(this.fuelConsumedPerLap);
        }

        if (this.lastLap !== -1) {
            const lapPercentage = CurrentLapDistance / TrackLength;
            this.estimatedFuelConsumedPerLap =
                (this.fuelAtBeginningOfLastLap - FuelLevel) * (1 / lapPercentage) * FuelCapacity;
        }

        if (this.currentLap !== this.lastLap) {
            this.lastLap = this.currentLap;
            this.fuelAtBeginningOfLastLap = FuelLevel;
        }

        // Strategy
        if ((LapsTimeInEvent & 1 << 16) === 1) {
            // this is not a lap based session (e.g. time trial)
            return;
        }
        this.totalLaps = LapsTimeInEvent & ~(1 << 16);

        const avgFuelConsumption: number = this.lapHistory.slice(-5).reduce((total, amount, index, array) => {
            total += amount;
            if (index === array.length - 1) { 
                return total / array.length;
            } else { 
                return total;
            }
        }, 0);
        
        // next stop
        const fuelLeftInLiters = FuelLevel * FuelCapacity;
        const lapsRemainingWithCurrentFuel = Math.floor(fuelLeftInLiters / avgFuelConsumption);
        const stops = [ CurrentLap + lapsRemainingWithCurrentFuel ];

        const lapsPerStint = Math.floor(FuelCapacity / avgFuelConsumption);
        for (let i = stops[0]; i < this.totalLaps; i += lapsPerStint) {
            stops.push(i);
        }
        this.stops = stops;

    }

}
</script>
