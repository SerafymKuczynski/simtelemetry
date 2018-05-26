<template>
    <v-card>
        <v-card-title class="secondary darken-2">
            <h3>{{ title }}</h3>
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
</template>

<script>
export default {
    props: ["title"]
}
</script>

<style>

</style>
