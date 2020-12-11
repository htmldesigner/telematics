import api from "../app/api";

export default {
 state: {
  routeList: null,
  geoZone: null,
  schedule: null,
  round: null,
  roundList: null
 },
 mutations: {
  SETROUTERLIST(state, payload) {
   state.routeList = Array.from(new Set(payload))
  },
  SET_GEOZONE_AS_CHECKPOINT(state, payload){
   state.geoZone = payload
  },

  SET_SCHEDULE(state, payload){
   state.schedule = payload
  },

  SET_ROUND_LISTS(state, payload){
   state.roundList = payload
   console.log(state.roundList)
  },

  SET_ROUND(state, payload){
   state.round = payload
  },

 },
 actions: {
  async getRouteList({commit, state}) {
   commit('clearError')
   commit('setLoading', true)

   function sortByPointOrder(arr) {
    arr.sort((a, b) => a.pointorder > b.pointorder ? 1 : -1);
   }

  function parseGeom(el){
    return JSON.parse(el)
   }

   try {
    let response = await api.getRouteList()
    if(response.data.data.length){
     response.data.data.forEach(el => {
      sortByPointOrder(el.points)
      el.points.forEach(p => {
       p.geom = parseGeom(p.geom)
      })
     })
     commit('SETROUTERLIST', response.data.data)
    }
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
  },

  async addSchedule({commit}, payload) {
   commit('clearError')
   commit('setLoading', true)
   try {
    await api.addSchedule(payload)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },

  async getSchedulesById({commit}, payload){
   commit('clearError')
   commit('setLoading', true)
   try {
   let response =  await api.getSchedulesById(payload)
    commit('SET_SCHEDULE', response.data.data)
    commit('SET_ROUND', response.data.data)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },

 async editSchedule({commit}, payload){
   commit('clearError')
   commit('setLoading', true)
   try {
    await api.editSchedule(payload)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },

  async deleteSchedule({commit}, payload) {
   commit('clearError')
   try {
    await api.deleteSchedule(payload)
   } catch (error) {
    commit('setError', error)
   }
  },

  async editRoute({commit}, payload) {
   commit('clearError')
   commit('setLoading', true)
   try {
    await api.editRoute(payload)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },

  async deleteRoute({commit}, payload) {
   commit('clearError')
   try {
    await api.deleteRoute(payload)
   } catch (error) {
    commit('setError', 'Необходимо удалить зависимые расписания')
   }
  },

  async getCheckPointGeozone({commit}, id) {
   commit('clearError')
   try {
    const response = await api.getGeozone(id)
    const items = response.data.data
    commit('SET_GEOZONE_AS_CHECKPOINT', items)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', 'Нет данных')
   }
  },


  async getFlightsForRoute({commit}, id){
   commit('clearError')
   try {
    const response = await api.getFlightsForRoute(id)
    const items = response.data
    commit('SET_ROUND_LISTS', items)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', 'Нет данных')
   }
  },

  async addFlight({commit}, payload){
   commit('clearError')
   commit('setLoading', true)
   try {
    await api.addFlight(payload)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },

  async deleteFlight({commit}, payload){
   commit('clearError')
   commit('setLoading', true)
   try {
    await api.deleteFlight(payload)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },

 },
 getters: {
  getSchedule: (state) => state.schedule,
  getRound: (state) => state.round,
  getRouteList: (state) => state.routeList,
  getGeoZoneCheckPoint: (state) => state.geoZone,
  getRoundList: (state) => state.roundList
 },
}