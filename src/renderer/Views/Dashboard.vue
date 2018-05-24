<template>
    <record-panel></record-panel>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import RecordPanel from "@/Components/RecordPanel.vue";

@Component({
    components: { RecordPanel }
})
export default class Dashboard extends Vue {
    public name = "dashboard"    
}
</script>

<style>

</style>