import api from "../app/api";

export default {
 state: {
  routeList: null
 },
 mutations: {
  SETROUTERLIST(state, payload){
   state.routeList = Array.from(new Set(payload))
  }
 },
 actions: {
  async getRouteList({commit, state}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    let response = await api.getRouteList()
    commit('SETROUTERLIST', response.data.data)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },
  async addRoute({commit}, payload) {
   commit('clearError')
   commit('setLoading', true)
   try {
    await api.addRoute(payload)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  }
 },
 getters: {
  getRouteList: (state) => state.routeList
 },
}