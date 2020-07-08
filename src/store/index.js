import Vue from 'vue'
import Vuex from 'vuex'
import monitoring from "./monitoring";
import user from "./user";
import common from "./common";
import mapInstance from "./mapInstance";



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mapInstance: null
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    common, user, monitoring
  }
})
