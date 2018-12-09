<template>
    <v-container fluid grid-list-lg class="ma-0">
        <v-layout row wrap>
            <v-flex>
                <dashboard-item title="Record">
                    <record-panel></record-panel>
                </dashboard-item>
            </v-flex>
            <v-flex>
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
import RecordPanel from "@/Components/Dashboard/RecordPanel.vue";
import LoadSavePanel from "@/Components/Dashboard/LoadSavePanel.vue";
import DashboardItem from "@/Components/Dashboard/DashboardItem.vue";

@Component({
    components: { RecordPanel, LoadSavePanel, DashboardItem }
})
export default class Dashboard extends Vue {
    public name = "dashboard";
}
</script>

<style>

</style>