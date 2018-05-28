<template>
    <v-layout>
        <v-flex xs6>
            <v-btn @click="load">Load Recording</v-btn>
        </v-flex>
        <v-flex xs6>
            <v-btn @click="save">Save Recording</v-btn>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class LoadSavePanel extends Vue {
    
    public load() {}

    public save() {}

}
</script>

<style>

</style>
