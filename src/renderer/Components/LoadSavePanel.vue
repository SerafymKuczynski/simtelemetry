<template>
    <v-layout>
        <v-flex xs6>
            <v-btn @click="load">Load Recording</v-btn>
        </v-flex>
        <v-flex xs6>
            <v-btn @click="save">Save Recording</v-btn>
        </v-flex>
        <v-dialog v-model="errorDialog" max-width="500">
            <v-card>
                <v-card-title class="headline">Error</v-card-title>
                <v-card-text>{{ errorText }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click.native="errorDialog = false">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ipcRenderer, IpcMessageEvent } from "electron";
import loadFile from "@/Data/LoadFile";

@Component
export default class LoadSavePanel extends Vue {

    public errorDialog = false;
    public errorText = "";
    
    public async load() {
        const err = await loadFile();
        if (err) { console.log(err); }
    }

    public save() {
        ipcRenderer.once("saveRecordingResult", (ev: IpcMessageEvent, result: string | undefined) => {
            if (result) { 
                this.errorText = result;
                this.errorDialog = true;
            }
        });
        ipcRenderer.send("saveRecording");
    }

}
</script>

<style>

</style>
