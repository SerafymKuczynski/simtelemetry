<template>
    <div>
        <v-select
            v-model="selectedClient"
            placeholder="Choose..."
            :items="clients"
        />
        <v-btn block @click="toggleRecording">
            <span v-if="isRecording" class="recordDot mr-2">&#x2B24;</span>
            {{ isRecording ? "Stop" : "Start" }} Recording
        </v-btn>
        <div color="text--error" v-if="errorText">{{ errorText }}</div>
        <div class="mt-3" v-if="statusText">{{ statusText }}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { ipcRenderer, IpcMessageEvent } from "electron";

@Component
export default class RecordPanel extends Vue {

    public isRecording = false;
    public errorText = "";
    public statusText = "";
    public selectedClient = "";
    public clients: string[] = [];

    @Watch("clients")
    onClientsChanged() {
        if (this.clients.length >= 1) {
            this.selectedClient = this.clients[0];
        }
    }

    toggleRecording() {
        if (this.isRecording) {
            ipcRenderer.send("stopClient");
        } else {
            ipcRenderer.send("startClient", this.selectedClient);
        }
    }

    mounted() {
        ipcRenderer.on("clientStart", () => { this.isRecording = true; });
        ipcRenderer.on("clientStop", () => { this.isRecording = false; });
        ipcRenderer.on("clientError", (ev: IpcMessageEvent, e: string) => { console.log(e); });
        ipcRenderer.on("clientStatusUpdate", (ev: IpcMessageEvent, s: string) => { this.statusText = s; });
        ipcRenderer.once("getClientsResult", (ev: IpcMessageEvent, c: string[]) => { this.clients = c; });
        ipcRenderer.send("getClients");
    }

}
</script>

<style>
@keyframes recordAnimation {
    from { opacity: 0; }
    to { opacity: 1; }
}

.recordDot {
    animation: recordAnimation 0.5s alternate 0s infinite;
}
</style>