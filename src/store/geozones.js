import api from "@/app/api"
import axios from "axios";

export default {
 state: {
  geozones: [],
  geozonesgroups: [],
  modifiablegeozone: [],
  selectedGeozone: []
 },

 mutations: {
  setGeozonesGroups(state, payload) {
   //Vue.set(state,'geozonesgroups',payload);
   state.geozonesgroups = payload;
  },

  setGeozones(state, payload) {
   //Vue.set(state,'geozones',payload);
   state.geozones = payload;
  },

  MODIFIABLE_GEOZONE(state, payload) {
   state.modifiablegeozone = payload
  },

  SELECTED_GEOZONE(state, payload) {
   if (Array.isArray(payload)) {
    payload.forEach(el => {
     el.selected = true, state.selectedGeozone.push(el)
    })

   } else {
    payload.selected = true
    state.selectedGeozone.push(payload)
   }
  },

  UNSELECT_GEOZONE(state, payload) {
   if (Array.isArray(payload)) {
    payload.forEach(id => {
     state.selectedGeozone = state.selectedGeozone.filter(el => el.id !== id)
    })
   } else {
    state.selectedGeozone = state.selectedGeozone.filter(el => el.id !== payload)
   }
  }

 },
 actions: {
  async loadGeozones({commit, state}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    const response = await api.getGeozones()
    const items = response.data.data
    state.selectedGeozone = []
    commit('setGeozonesGroups', items.geozonesgroups)
    commit('setGeozones', items.geozones)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', 'error conection')
    throw error
   }
  },

  saveGeozones({commit, state}, params) {
   return Promise.resolve(api.saveGeozoneGeometry(params.id, params.layersData).then(response => {
    if (response.status == 200) {
    } else {
     console.errors(response.data);
     commit('setError', 'error conection')
    }
   }).catch(error => {
    commit('setError', error)
   }));
  },

  async getSelectedGeozone({commit}, id) {
   commit('clearError')
   try {
    const response = await api.getGeozone(id)
    const items = response.data.data
    commit('SELECTED_GEOZONE', items)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },

  async getModifiableGeozone({commit}, id) {
   commit('clearError')
   try {
    const response = await api.getGeozone(id)
    const items = response.data.data
    commit('MODIFIABLE_GEOZONE', items)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },


  async getSelectedGeozoneGroup({commit}, id) {
   commit('clearError')
   try {
    const response = await api.getGeozonesTree(id)
    const items = response.data.data
    commit('SELECTED_GEOZONE', items)
   } catch (error) {
    console.log(error)
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },

  unselectGeozone({commit}, id) {
   commit('UNSELECT_GEOZONE', id)
  }

 },

 getters: {
  getGeozonesGroups: state => state.geozonesgroups,
  getGeozones: state => state.geozones,
  selectedGeozone: state => state.selectedGeozone,
  getModifiableGeozone: state => state.modifiablegeozone
 },


}