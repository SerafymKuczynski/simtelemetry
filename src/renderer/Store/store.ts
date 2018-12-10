import Vue from "vue";
import Vuex from "vuex";

import Database from "../Data/Database";
import SimClientManager from "../SimClients/SimClientManager";

Vue.use(Vuex);

const scm = new SimClientManager();
const db = new Database(scm);

export default new Vuex.Store({
    state: {
        database: db,
        scManager: scm
    }
});
