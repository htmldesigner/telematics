import api from "@/app/api"
import axios from "axios";

export default {
 state: {
  speedLimits: []
 },
 getters: {
  getSpeedLimits: state => state.speedLimits,
  getSpeedLimitsColor: state => state.speedLimits.map(sp => sp.color),
  getSpeedLimitsValue: state => state.speedLimits.map(sp => sp.speed - 0),
 },
 mutations: {
  setSpeedLimits(state, payload) {
   Vue.set(state, 'speedLimits', payload.speedindex);
  },
  addSpeedLimits(state, payload) {
   state.speedLimits.push(payload);
   //state.tracks = payload;
  },
  deleteSpeedLimits(state, payload) {
   // by index
   state.speedLimits.splice(payload, 1);
  }
 },
 actions: {
  saveState({commit, state}, savedstate) {
   return api.saveState(savedstate);

  },
  async loadState({commit, state}) {
   const response = await api.loadState()
   let data = await JSON.parse(response.data.data);
   console.log(data)
   commit('setSpeedLimits', data)
  },
  clearObjects({commit}) {
   //commit('clearObjectsAll')
  }
 }
}