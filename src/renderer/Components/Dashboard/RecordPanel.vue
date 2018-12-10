<template>
    <div>
        <v-select
            v-model="selectedClient"
            placeholder="Choose..."
            :items="clients"
        />
        <v-btn block @click="toggleRecording">
            {{ isConnected ? "Disconnect" : "Connect" }}
        </v-btn>
        <div class="error--text" v-if="errorText">{{ errorText }}</div>
        <div class="mt-3" v-if="statusText">{{ statusText }}</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import SimClientManager from "../../SimClients/SimClientManager";

@Component
export default class RecordPanel extends Vue {

    public errorText = "";
    public statusText = "";
    public selectedClient = "";

    get scm() {
        return this.$store.state.scManager as SimClientManager;
    }

    get clients() {
        return this.scm.clients.map((c) => c.name);
    }

    get isConnected() {
        return this.scm.activeClient && this.scm.activeClient.isRunning;
    }

    get status() {
        return this.scm.activeClient && this.scm.activeClient.status || "";
    }

    toggleRecording() {
        this.errorText = "";
        try {
            if (this.isConnected) {
                this.scm.stopClient();
            } else {
                this.scm.startClient(this.selectedClient);
            }
        } catch (err) {
            this.errorText = err && err.message || "Error";
        }
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