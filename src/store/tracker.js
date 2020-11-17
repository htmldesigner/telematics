import api from "@/app/api"

export default {
 state: {
  tracks: null,
  stops: null
 },
 mutations: {
  SETTRACK(state, payload) {
   state.tracks = payload
  },
  SETSTOP(state, payload) {
   payload ? state.stops = payload : state.stops = null
  }
 },
 actions: {
  async loadTracks({commit}, query) {
   commit('clearError')
   commit('setLoading', true)
   try {
    let response = await api.serviceQuery(query)
    if (response.data.data && response.status === 200) {
     return response
    }
    commit('clearError')
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },

  async clearTracksRaport({commit}){
   commit('SETSTOP', null)
   commit('SETTRACK', null)
  }

 },
 getters: {
  getOverSpeedTrack(state) {
   return state.tracks?.features
  },
  getStop(state) {
   return state.stops
  }
 }
}