<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs12 md6 lg4>
                <dashboard-item title="Record">
                    <record-panel></record-panel>
                </dashboard-item>
            </v-flex>
            <v-flex xs12 md6 lg4>
                <dashboard-item title="Load / Save">
                    <load-save-panel></load-save-panel>
                </dashboard-item>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import RecordPanel from "@/Components/RecordPanel.vue";
import LoadSavePanel from "@/Components/LoadSavePanel.vue";
import DashboardItem from "@/Components/DashboardItem.vue";

@Component({
    components: { RecordPanel, LoadSavePanel, DashboardItem }
})
export default class Dashboard extends Vue {
    public name = "dashboard"
}
</script>

<style>

</style>