import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

import Dashboard from "@/Views/Dashboard.vue";
// import RawGraph from "@/Views/RawGraph.vue";
import FuelMonitor from "@/Views/FuelMonitor.vue";

export default new Router({
    routes: [
        {
            path: "/",
            name: "dashboard",
            component: Dashboard
        },
        /*{
            path: "/rawgraph",
            name: "rawgraph",
            component: RawGraph
        },*/
        {
            path: "fuel",
            name: "fuel",
            component: FuelMonitor
        },
        {
            path: "*",
            redirect: "/"
        }
    ]
});
