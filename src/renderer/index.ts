import Vue from "vue";

// Vuetify
import Vuetify from "vuetify";
import "../../node_modules/vuetify/dist/vuetify.min.css";
Vue.use(Vuetify);

// Vuetify needs Material icons, so inject a script tag into site
const head = document.head || document.getElementsByTagName("head")[0];
const node = document.createElement("link");
node.setAttribute("rel", "stylesheet");
node.setAttribute("href", "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons");
head.appendChild(node);

import App from "./App.vue";
import router from "./router";

new Vue({
    components: { App },
    router,
    template: "<App/>"
}).$mount("#app");
