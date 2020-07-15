import Vue from 'vue'
import Vuex from 'vuex'
import monitoring from "./monitoring";
import sittings from "./sittings";
import common from "./common";

import mapModule from './modules/mapInstance'

Vue.use(Vuex)

 const store = new Vuex.Store({
  state: {
   mapInstance: null
  },
  mutations: {
  },
  actions: {
  },
  modules: {
   sittings,
   common,
   monitoring,
  }
})

store.registerModule('mapModule', mapModule)

export default store