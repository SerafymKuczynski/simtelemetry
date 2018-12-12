<template>
    <div class="timeline">

        <div class="timeline __bar">
            <div id="filler" class="timeline __bar __filled" :style="{ 'width': progress + '%' }"></div>
        </div>

        <div
            v-for="(stop, i) in percentageStops"
            :key="i"
            :class="['timeline', '__dot', { '--active': progress >= stop.v }]"
            :style="{ 'left': stop.v + '%' }"
        ><div>Lap {{ stop.l }}</div></div>

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Timeline extends Vue {

    @Prop({ type: Number, default: 0 })
    currentLap!: number;

    @Prop({ type: Number, default: 1 })
    totalLaps!: number;

    @Prop({ type: Array, default: () => [] })
    stops!: number[];

    get progress() {
        return this.totalLaps !== 0 ? 100 * this.currentLap / this.totalLaps : 0;
    }

    get percentageStops() {
        if (this.totalLaps === 0) {
            return [];
        } else {
            return this.stops.map((s) => ({ l: s, v: 100 * s / this.totalLaps }));
        }
    }

}
</script>

<style lang="scss">
.timeline {
    position: relative;
    height: 35px;

    .__bar {
        position: absolute;
        left: 0;
        top: 0;
        height: 6px;
        width: 100%;
        background-color: lightgray;

        .__filled {
            height: 100%;
            background-color: deepskyblue;
            transition: width 0.4s ease-in-out;
        }

    }

    .__dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: lightgray;
        position: absolute;
        top: -7px;
        transition: background-color 0.4s linear, left 0.4s ease-in-out;

        &.--active {
            background-color: deepskyblue;
        }

        & > div {
            text-align: center;
            position: absolute;
            white-space: nowrap;
            top: 125%;
            left: 50%;
            transform: translate(-50%, 0);
        }

    }

}
</style>
