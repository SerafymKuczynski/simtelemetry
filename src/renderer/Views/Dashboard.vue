<template>
    <div>
        <record-panel></record-panel>
        <load-save-panel></load-save-panel>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import RecordPanel from "@/Components/RecordPanel.vue";
import LoadSavePanel from "@/Components/LoadSavePanel.vue";

@Component({
    components: { RecordPanel, LoadSavePanel }
})
export default class Dashboard extends Vue {
    public name = "dashboard"
}
</script>

<style>

</style>