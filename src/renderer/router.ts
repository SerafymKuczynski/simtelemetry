import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

import Dashboard from "@/Views/Dashboard.vue";

export default new Router({
    routes: [
        {
            path: "/",
            name: "dashboard",
            component: Dashboard
        },
        {
            path: "*",
            redirect: "/"
        }
    ]
});
