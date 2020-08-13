export default {
 state: {
  stopRaport: null,
  overSpeedRaport: null,
 },

 mutations: {
  SET_STOP_RAPORT(state, payload){
   state.stopRaport = payload
   console.log(state.stopRaport)
  },
  SET_OVER_SPEED_RAPORT(state, payload){
   state.overSpeedRaport = payload
  }
 },
 actions: {
  setStopRaport({commit}, payload){
   commit('SET_STOP_RAPORT', payload)
  },
  setOverSpeedRaport({commit}, payload){
   commit('SET_OVER_SPEED_RAPORT', payload)
  }
 },
 getters: {

 },
}