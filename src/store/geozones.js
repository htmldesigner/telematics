import api from "@/app/api"
import axios from "axios";

export default {
 state: {
  geozones: {},
  geozonesgroups: [],
  geotree: [],
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
  setGeotree(state, payload) {
   //Vue.set(state,'geotree',payload);
   state.geotree = payload;
  },
  // setGeozone(state, payload) {
  //  Vue.set(state.geozones, payload.id, payload.geozone);
  // },
  // deselectAllGeozones(state) {
  //  Geozone.keys(state.geozones).forEach(_ => state.geozones[_].selected = false);
  // },
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
    payload.forEach(el => {
     let index = state.selectedGeozone.findIndex(n => n.id === el)
     console.log(index)
     if (index !== -1) {
      state.selectedGeozone.splice(index, 2);
     }
    })
   }
  }

  // selectGeozonesGroup(state, payload) {
  //  state.geozonesgroups[payload.id].selected = payload.value;
  // },
  // clearGeozonesAll(state) {
  //  state.geozones = []
  //  state.geozonesgroups = []
  // }
 },
 actions: {
  async loadGeozones({commit}) {
   commit('clearError')
   try {
    const response = await api.getGeozones()
    const items = response.data.data
    commit('setGeozonesGroups', items.geozonesgroups)
    commit('setGeozones', items.geozones)
    commit('setGeotree', items.geotree)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', 'error conection')
    throw error
   }
  },

  async getSelectedGeozone({commit}, id) {
   commit('clearError')
   try {
    const response = await api.getGeozone(id)
    const items = response.data.data
    commit('SELECTED_GEOZONE', items)
   } catch (error) {
    console.log(error)
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
  getGeotree: state => state.geotree,
  selectedGeozone: state => state.selectedGeozone
  // getSelectedGeozones(state) {
  //  return Object.filter(state.geozones, _ => _.selected);
  // },
  // getSelectedGeozonesId(state, getters) {
  //  return Object.keys(getters.getSelectedGeozones).filter(function (value, index, self) {
  //   return self.indexOf(value) == index;
  //  })
  // }
 },


}