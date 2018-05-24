<template>
    <v-layout>        
        <v-flex lg4 md6 xs12>
            <v-card>
                <v-card-title class="secondary darken-2">
                    <h3>Record</h3>
                </v-card-title>
                <v-card-text>
                    <v-select
                        v-model="selectedClient"
                        placeholder="Choose..."
                        :items="clients"
                    />
                    <v-btn @click="toggleRecording">
                        {{ isRecording ? "Stop" : "Start" }} Recording
                    </v-btn>
                    <div color="text--error" v-if="errorText">{{ errorText }}</div>
                    <div v-if="statusText">{{ statusText }}</div>
                </v-card-text>
            </v-card>
        </v-flex>        
    </v-layout>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
    data() {
        return {
            isRecording: false,
            errorText: "",
            statusText: "",
            selectedClient: ""
        }
    },
    computed: {
        clients() {
            // return ipcRenderer.sendSync("getClients");
            return [ "Project Cars 2" ];
        }
    },
    methods: {
        toggleRecording() {
            if (this.isRecording) {
                ipcRenderer.send("stopClient");
            } else {
                ipcRenderer.send("startClient", this.selectedClient);
            }
        }
    },
    mounted() {
        ipcRenderer.on("clientStart", () => { this.isRecording = true; });
        ipcRenderer.on("clientStop", () => { this.isRecording = false; });
        ipcRenderer.on("clientStatusUpdate", (ev, s) => { this.statusText = s; });
    }
}
</script>

<style>

</style>