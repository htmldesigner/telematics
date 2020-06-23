import Vue from 'vue'
import Vuex from 'vuex'
import monitoring from "./monitoring";
import user from "./user";
import common from "./common";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    common, user, monitoring
  }
})
