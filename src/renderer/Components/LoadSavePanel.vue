<template>
    <v-layout>
        <v-flex lg4 md6 xs12>
            <dashboard-item title="Load / Save">
                <v-layout>
                    <v-flex xs6>
                        <v-btn @click="load">Load Recording</v-btn>
                    </v-flex>
                    <v-flex xs6>
                        <v-btn @click="save">Save Recording</v-btn>
                    </v-flex>
                </v-layout>
            </dashboard-item>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DashboardItem from "@/Components/DashboardItem.vue";

@Component({
    components: { DashboardItem }
})
export default class LoadSavePanel extends Vue {
    
    public load() {}

    public save() {}

}
</script>

<style>

</style>
