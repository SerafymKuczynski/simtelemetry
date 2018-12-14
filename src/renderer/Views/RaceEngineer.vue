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
                            <div class="title font-weight-light mb-2">Fuel Consumption</div>
                            <h1 class="font-weight-regular">{{ averageFuelConsumption.toFixed(2) }} liters</h1>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex xs4>
                    <v-card style="text-align: center;">
                        <v-card-text>
                            <div class="title font-weight-light mb-2">Estimated Fuel per Lap</div>
                            <h1 class="font-weight-regular">{{ estimatedFuelConsumption.toFixed(2) }} liters</h1>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex xs12>
                    <v-card>
                        <v-card-title primary-title>
                            <div class="headline">Strategy</div>
                        </v-card-title>
                        <v-card-text>
                            <c-timeline
                                class="mb-3"
                                :currentLap="currentLap"
                                :totalLaps="lapsInEvent"
                                :stops="strategy"
                            ></c-timeline>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex xs8>
                    <v-card>
                        <v-card-text>
                            <v-layout>
                                <v-flex class="d-flex" style="justify-content:center;">
                                    <div class="headline" style="align-self:center;text-align:center;">Lockup Detector</div>
                                </v-flex>
                                <v-flex style="text-align:center;">
                                    <div class="lockup-container">
                                        <div class="tire">
                                            <div class="tire __lockup" :style="{ 'opacity': lockupValues[0] / 60 }"></div>
                                        </div>
                                        <div class="tire">
                                            <div class="tire __lockup" :style="{ 'opacity': lockupValues[1] / 60 }"></div>
                                        </div>
                                    </div>
                                    <div class="lockup-container">
                                        <div class="tire">
                                            <div class="tire __lockup" :style="{ 'opacity': lockupValues[2] / 60 }"></div>
                                        </div>
                                        <div class="tire">
                                            <div class="tire __lockup" :style="{ 'opacity': lockupValues[3] / 60 }"></div>
                                        </div>
                                    </div>
                                </v-flex>
                            </v-layout>
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
export default class RaceEngineer extends Vue {

    // These variables come from PC2
    trackLength = 0;
    lapsInEvent = -1;
    fuelLevel = 0;
    fuelCapacity = 0;
    currentLap = 0;
    currentLapDistance = 0;

    // These variables hold internal state
    fuelAtBeginningOfLastLap = -1;
    lapHistory: number[] = [];
    stops: number[] = [];
    lockupValues = [0, 0, 0, 0];

    /**
     * @returns Current fuel level in the car in liters
     */
    get currentFuel() {
        return this.fuelLevel * this.fuelCapacity;
    }

    /**
     * Calculates the average fuel consumption based
     * on the fuel consumption of the last five laps
     * @returns Average fuel consumption in liters per lap
     */
    get averageFuelConsumption() {
        const sliced = this.lapHistory.slice(-5);
        if (sliced.length === 0) { return 0; }
        const sum = sliced.reduce((s, v) => s + v, 0);
        return (sum / sliced.length) * this.fuelCapacity;
    }

    /**
     * Calculates the estimated fuel consumption for this lap
     * based on the consumption so far
     * @returns Estimated fuel consumption for this lap in liters
     */
    get estimatedFuelConsumption() {
        if (this.trackLength === 0 || this.currentLapDistance === 0) {
            return 0;
        }
        const lapPercentage = this.currentLapDistance / this.trackLength;
        return (this.fuelAtBeginningOfLastLap - this.fuelLevel) * (1 / lapPercentage) * this.fuelCapacity;
    }

    get strategy(): number[] {
        
        if (this.lapsInEvent === -1 || this.averageFuelConsumption <= 0) {
            return this.stops;
        }

        const lapsRemainingWithCurrentFuel = Math.floor(this.currentFuel / this.averageFuelConsumption);
        const s = this.stops.concat([ this.currentLap + lapsRemainingWithCurrentFuel ]);

        const lapsPerStint = Math.floor(this.fuelCapacity / this.averageFuelConsumption);
        if (lapsPerStint <= 0) {
            return this.stops;
        }
        for (let i = s[s.length - 1]; i < this.lapsInEvent; i += lapsPerStint) {
            s.push(i);
        }
        return s;

    }

    mounted() {
        const scm = this.$store.state.scManager as SimClientManager;
        scm.subscribe(this, (df) => { this.calculate(df as IPC2State); });
    }

    beforeDestroy() {
        const scm = this.$store.state.scManager as SimClientManager;
        scm.unsubscribe(this);
    }

    private calculate(state: IPC2State) {
        const { TrackLength, LapsTimeInEvent } = state.meta;
        const { FuelLevel, FuelCapacity, Participants, LocalParticipantIndex, Speed, TyreRPS } = state.values;
        const p = Participants[LocalParticipantIndex];
        const { CurrentLap, CurrentLapDistance } = p;
        this.trackLength = TrackLength || 0;
        this.currentLapDistance = CurrentLapDistance || 0;
        this.fuelCapacity = FuelCapacity || 0;

        if (FuelLevel > this.fuelLevel && this.fuelLevel > 0) {
            // we have more fuel than we had last tick
            // so this means we are likely doing a pitstop atm
            if (!this.stops.includes(CurrentLap)) {
                console.log("Pitstop");
                this.stops.push(CurrentLap);
            }
            // to prevent negative fuel consumption
            this.fuelAtBeginningOfLastLap = FuelLevel;
        }
        this.fuelLevel = FuelLevel || 0;

        if ((LapsTimeInEvent & 1 << 16) === 1) {
            this.lapsInEvent = -1;
        } else {
            this.lapsInEvent = LapsTimeInEvent & ~(1 << 16);
        }

        // lap change detection
        if (this.currentLap > CurrentLap) {
            // probably race restart
            console.log("Race Restart");
            this.reset();
            this.currentLap = 0;
        } else if (this.currentLap !== CurrentLap) {
            console.log("Lap Change");
            if (this.fuelAtBeginningOfLastLap > 0) {
                this.lapHistory.push(this.fuelAtBeginningOfLastLap - FuelLevel);
            }
            this.currentLap = CurrentLap || 0;
            this.fuelAtBeginningOfLastLap = FuelLevel || 0;
        }

        TyreRPS.forEach((v, i) => {
            if (Speed > 5 && Math.abs(v) < 1) {
                if (this.lockupValues[i] < 60) {
                    this.lockupValues[i]++;
                }
            } else if (this.lockupValues[i] > 0) {
                this.lockupValues[i]--;
            }
        });

    }

    private reset() {
        this.fuelAtBeginningOfLastLap = -1;
        this.lapHistory = [];
        this.stops = [];
    }

}
</script>

<style>
.lockup-container {
    display: inline-block;
}

.tire {
    width: 30px;
    height: 50px;
    position: relative;
    background-color: gray;
    margin: 10px;
}
.tire > .__lockup {
    margin: 0;
    width: 100%;
    height: 100%;
    background-color: red;
}
</style>

