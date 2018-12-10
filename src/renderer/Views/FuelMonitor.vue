<template>
    <h1>Fuel: {{fuel}} Liter</h1>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SimClientManager from "../SimClients/SimClientManager";

@Component
export default class FuelMonitor extends Vue {

    fuel: number = 0;

    mounted() {
        const scm = this.$store.state.scManager as SimClientManager;
        scm.subscribe(this, (df) => {
            this.$set(this, "fuel", df.values.FuelLevel * df.values.FuelCapacity);
        });
    }

    beforeDestroy() {
        const scm = this.$store.state.scManager as SimClientManager;
        scm.unsubscribe(this);
    }

}
</script>
