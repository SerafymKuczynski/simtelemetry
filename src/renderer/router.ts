import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

import Dashboard from "@/Views/Dashboard.vue";
import RawGraph from "@/Views/RawGraph.vue";
import RaceEngineer from "@/Views/RaceEngineer.vue";

export default new Router({
    routes: [
        {
            path: "/",
            name: "dashboard",
            component: Dashboard
        },
        {
            path: "/rawgraph",
            name: "rawgraph",
            component: RawGraph
        },
        {
            path: "engineer",
            name: "engineer",
            component: RaceEngineer
        },
        {
            path: "*",
            redirect: "/"
        }
    ]
});
