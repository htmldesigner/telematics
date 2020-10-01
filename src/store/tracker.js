import api from "@/app/api"

export default {
 state: {
  tracks: [],
 },
 mutations: {

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

 },
 getters: {
 }
}