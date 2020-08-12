import api from "@/app/api"

export default {
 state: {
  tracks: [],
 },
 mutations: {
  ADD_TRACK(state, payload) {
   state.tracks.push(payload);
   console.log(state.tracks)
  },
  REMOVE_TRACK_IN_PLAYER(state, id) {
   state.tracks = state.tracks.filter(el => el.info.id !== id)
   console.log(state.tracks)
  }
 },
 actions: {
  async loadTracks({commit}, {query}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    let response =  await api.serviceQuery(query)
    commit('clearError')
    commit('setLoading', false)
    return response
   } catch (e) {
    commit('setLoading', false)
    commit('setError', 'Ошибка загрузкм трека')
   }
  },

  removeTrackInPlayer({commit}, id) {
   commit('REMOVE_TRACK_IN_PLAYER', id)
  }

 },
 getters: {
  getTracks(state) {
   return state.tracks
  },
 }
}