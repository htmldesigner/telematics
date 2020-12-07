import api from "../app/api";

export default {
 state: {
  routeList: null,
  geoZone: null,
  schedule: null,
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
    commit('setError', error)
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


 },
 getters: {
  getSchedule: (state) => state.schedule,
  getRouteList: (state) => state.routeList,
  getGeoZoneCheckPoint: (state) => state.geoZone
 },
}