<template>
    <g></g>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import * as d3 from "d3";

@Component
export default class GLine extends Vue {

    @Prop()
    data!: number[];

    @Watch("data")
    onDataChange() {
        if (!this.data) { return; }
        d3.select(this.$el).selectAll("*").remove();

        let min = d3.min(this.data)!;
        if (min > 0) { min = 0; }
        const max = d3.max(this.data)!;

        const x = d3.scaleLinear()
            .domain([0, this.data.length])
            .range([0, 300]);
        const y = d3.scaleLinear()
            .domain([min, max])
            .range([150, 0]);

        const line = d3.line()
            .x((d, i) => x(i))
            .y((d) => {
                return y(d as any);
            });

        d3.select(this.$el)
            .append("path")
            .datum(this.data)
            .attr("stroke", "white")
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .attr("d", line as any);
    }

    mounted() {
        this.onDataChange();
    }

}
</script>

<style>

</style>
