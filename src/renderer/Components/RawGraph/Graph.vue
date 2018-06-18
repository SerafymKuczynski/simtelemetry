<template>
    <svg class="fill-height" style="width: 100%;">

        <defs>
            <clipPath id="clip">
                <rect :width="width" :height="mainHeight" x="0" y="0"></rect>
            </clipPath>
        </defs>

        <!-- Lines in Main Area -->
        <g id="mainLineContainer" :transform="mainTransform">
            <path
                v-for="series in data"
                :key="series.id"
                :datum="series.data"
            ></path>
        </g>

        <!-- Main Area -->
        <g :transform="mainTransform">
            <g id="mainXAxis" class="axis axis--x" :transform="mainXAxisTransform"></g>
            <g id="mainYAxis" class="axis axis--y"></g>
        </g>

        <!-- Preview Area -->
        <g>
            <g id="previewXAxis" class="axis axis--x" :transform="previewXAxisTransform"></g>
            <g id="previewBrush" class="brush"></g>
        </g>

        <!-- Zoom Rect -->
        <rect class="zoom" :width="width" :height="mainHeight" :transform="mainTransform"></rect>

    </svg>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import * as d3 from "d3";
import { IRawDataSeries } from "./interfaces";
import * as _ from "lodash";

@Component
export default class Graph extends Vue {

    private readonly throttledResize = _.throttle(this.calculateSizes, 300);

    @Prop({ default: [] })
    public data!: IRawDataSeries[];

    public transformedData: IRawDataSeries[] = [];

    // layout constants
    public readonly marginLeft = 40;
    public readonly marginRight = 20;
    public readonly previewHeight = 100;

    public readonly marginMain = {
        top: 20,
        bottom: 30
    };

    public readonly marginPreview = {
        top: 20,
        bottom: 30
    };

    // calculated values
    public width = 0;
    public mainHeight = 0;
    public readonly mainTransform = `translate(${this.marginLeft},${this.marginMain.top})`;
    public previewXAxisTransform = "translate(0, 0)";

    // scales
    public mainXScale = d3.scaleLinear();
    public mainYScale = d3.scaleLinear();
    public previewXScale = d3.scaleLinear();
    public previewYScale = d3.scaleLinear().range([this.previewHeight, 0]);

    // axis
    public mainXAxis = d3.axisBottom(this.mainXScale);
    public mainYAxis = d3.axisLeft(this.mainYScale).ticks(0);
    public previewXAxis = d3.axisBottom(this.previewXScale);

    // brush & zoom
    public readonly brush = d3.brushX().on("brush end", this.brushed);
    public readonly zoom = d3.zoom().scaleExtent([1, Infinity]).on("zoom", this.zoomed);

    // line
    public readonly line = d3.line()
        .x((d: any) => this.mainXScale(d.tick))
        .y((d: any) => this.mainYScale(d.value));

    public get mainXAxisTransform() {
        return `translate(0, ${this.mainHeight})`;
    }

    public mounted(): void {

        this.calculateSizes();
        window.addEventListener("resize", this.throttledResize);

        const root = d3.select(this.$el);

        root.select("#mainXAxis").call(this.mainXAxis as any);
        root.select("#mainYAxis").call(this.mainYAxis as any);
        root.select("#previewXAxis").call(this.previewXAxis as any);

    }

    @Watch("data")
    public onDataChange(): void {

        const maxTick = d3.max(this.data, (ds) => d3.max(ds.data, (dp) => dp.tick)) || 1;
        this.mainXScale.domain([0, maxTick]);
        d3.selectAll(".line").remove();

        this.data.map((ds) => {
            // normalize values
            const min = d3.min(ds.data, (dp) => dp.value) || 0;
            const max = d3.max(ds.data, (dp) => dp.value) || 0;
            const normalizedValues = ds.data.map((dp) => {
                return {
                    tick: dp.tick,
                    value: (dp.value - min) / (max - min)
                };
            });
            return {
                id: ds.id,
                data: normalizedValues
            };
        }).forEach((ds) => {
            d3.select("#mainLineContainer")
                .append("path")
                .datum(ds.data)
                .attr("class", "line")
                .attr("d", this.line as any);
        });

    }

    public calculateSizes(): void {

        const { width: svgWidth, height: svgHeight } = this.$el.getBoundingClientRect();

        console.log(`SVG: ${svgWidth}x${svgHeight}`);

        this.width = svgWidth - this.marginLeft - this.marginRight;
        this.mainHeight = svgHeight - this.marginMain.top - this.marginMain.bottom
                        - this.marginPreview.top - this.marginPreview.bottom - this.previewHeight;

        this.previewXAxisTransform = `translate(${this.marginLeft}, ${svgHeight - this.marginPreview.bottom})`;

        this.mainXScale.range([0, this.width]);
        this.mainYScale.range([this.mainHeight, 0]);
        this.previewXScale.range([0, this.width]);

        this.brush.extent([[0, 0], [this.width, this.previewHeight]]);
        this.zoom
            .translateExtent([[0, 0], [this.width, this.mainHeight]])
            .extent([[0, 0], [this.width, this.mainHeight]]);

    }

    public brushed(): void {
        // TODO
    }

    public zoomed(): void {
        // TODO
    }

}
</script>

<style>

.axis {
    stroke: white;
    stroke-width: 1px;
}
.axis > .domain {
    stroke: white;
}
.axis > .tick > line {
    stroke: white;
}

.line {
    fill: none;
    stroke: steelblue;
    stroke-width: 1.5px;
}

.zoom {
    cursor: move;
    fill: none;
    pointer-events: all;
}

</style>
