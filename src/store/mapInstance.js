export default {
 // namespaced: true,
 state: {

 },
 getters: {},
 mutations: {
  SET_MAP_INSTANCE(state, mapInstance) {
   state.mapInstance = mapInstance
  },
 },
 actions: {
  loadMap({commit}, map) {
   commit('SET_MAP_INSTANCE', map)
  }
 },
}
