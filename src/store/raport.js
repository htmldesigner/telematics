import Vue from 'vue'
import api from "@/app/api"
export default {
 state: {
  stopRaport: null,
  overSpeedRaport: null,

 },

 mutations: {
  SET_STOP_RAPORT(state, payload) {
   state.stopRaport = Object.map(payload, el => {
    return el.data
   })
  },
  SET_OVER_SPEED_RAPORT(state, payload) {
   state.overSpeedRaport = Object.map(payload, el => {
    return el.data
   })
  },

  SET_ALL_TRACK_RAPORT(state, payload) {
   state.allTrackRaport = { ...state.allTrackRaport, track: payload };
  },

  CLEAR_TRACK_RAPORT_STOP(state, payload) {
   state.stopRaport = null
  },
  CLEAR_TRACK_RAPORT_OVERSPEED(state, payload) {
   state.overSpeedRaport = null
  },
  CLEAR_TRACK_ALL_RAPORT(state, payload) {
   state.overSpeedRaport = null,
    state.stopRaport = null
  }
 },

 actions: {
  setStopRaport({commit}, payload) {
   commit('SET_STOP_RAPORT', payload)
  },
  setOverSpeedRaport({commit}, payload) {
   commit('SET_OVER_SPEED_RAPORT', payload)
  },
  setAllTrackRaport({commit, getters}, payload) {
  let objInfo = {...getters.getObjects[payload.objectId]}
  let track = payload
  track.name = objInfo.name
  track.imei = objInfo.imei
  track.reg_number =  objInfo.reg_number
   commit('SET_ALL_TRACK_RAPORT', track)
  },
  clearTrackRaportStop({commit}, payload) {
   commit('CLEAR_TRACK_RAPORT', payload)
  },
  clearTrackRaportOverSpeed({commit}, payload) {
   commit('CLEAR_TRACK_RAPORT', payload)
  },
  clearTrackRaport({commit}, payload) {
   commit('CLEAR_TRACK_ALL_RAPORT')
  },

  async loadRaport({commit}, query) {
   commit('clearError')
   commit('setLoading', true)
   try {
    let response =  await api.serviceQuery(query)
    commit('clearError')
    commit('setLoading', false)
    console.log(response)
    return response
   } catch (e) {
    commit('setLoading', false)
    commit('setError', 'Ошибка загрузкм трека')
   }
  },


 },
 getters: {
  getStopRaport(state) {
   return state.stopRaport
  },
  getOverSpeedRaport(state) {
   return state.overSpeedRaport
  },
  getAllTrackRaport(state) {
   return state.allTrackRaport
  }
 },
}