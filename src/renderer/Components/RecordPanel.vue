<template>
    <div>
        <v-select
            v-model="selectedClient"
            placeholder="Choose..."
            :items="clients"
        />
        <v-btn @click="toggleRecording">
            <span v-if="isRecording" class="recordDot mr-2">&#x2B24;</span>
            {{ isRecording ? "Stop" : "Start" }} Recording
        </v-btn>
        <div color="text--error" v-if="errorText">{{ errorText }}</div>
        <div v-if="statusText">{{ statusText }}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DashboardItem from "@/Components/DashboardItem.vue";
import { ipcRenderer, IpcMessageEvent } from "electron";

@Component({
    components: { DashboardItem }
})
export default class RecordPanel extends Vue {

    public isRecording = false;
    public errorText = "";
    public statusText = "";
    public selectedClient = "";
    public clients: string[] = [];

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