<template>
    <v-app dark>

        <v-navigation-drawer clipped fixed stateless :value="true" app>
            <v-list dense>
                <v-list-tile
                    v-for="item in navItems"
                    :key="item.name"
                    @click="navigate(item.route)"
                >
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar app fixed clipped-left>
            <v-toolbar-title>SimTelemetry</v-toolbar-title>
        </v-toolbar>

        <v-content>
            <v-container fill-height style="align-items:start;">
                <router-view></router-view>
            </v-container>
        </v-content>

        <v-footer app fixed>
            <span class="ml-3">SimTelemetry v0.1 - <a href="javascript:void()" @click="openGithub()">GitHub</a></span>
        </v-footer>

    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class App extends Vue {

    public readonly name = "SimTelemetry";
    public readonly navItems = [
        { name: "Dashboard", icon: "dashboard", route: "dashboard" },
        { name: "Settings", icon: "settings" },
        { name: "Raw Graph", icon: "show_chart", route: "rawgraph" },
        { name: "Race Engineer", icon: "headset_mic", route: "engineer" }
    ];

    public navigate(target: string) {
        if (target) {
            this.$router.push({ name: target });
        }
    }

    public openGithub() {
        
    }

};
</script>

<style>

</style>
