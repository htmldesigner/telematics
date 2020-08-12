import Vue from 'vue'
import Vuex from 'vuex'
import monitoring from "./monitoring";
import sittings from "./sittings";
import common from "./common";
import tracker from "./tracker";
import profile from "./profile";
import geozones from "./geozones";
import setup from "./setup";
import mapModule from './modules/mapInstance'

import draw from './draw'
import playbackModule from './modules/playbackInstance'

Vue.use(Vuex)

 const store = new Vuex.Store({
  state: {
   mapInstance: null,
   playbackInstance: null
  },
  mutations: {
  },
  actions: {
  },
  modules: {
   sittings,
   common,
   monitoring,
   tracker,
   profile,
   draw,
   geozones,
   setup
  }
})

store.registerModule('mapModule', mapModule)
store.registerModule('playbackModule', playbackModule)

export default store