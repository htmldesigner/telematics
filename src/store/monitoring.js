import api from "@/app/api"
import axios from "axios";

export default ({
 state: {
  objects: [],
  objectsgroups: [],
  flyTo: []
 },
 mutations: {
  setObjects(state, payload) {
   state.objects = payload
  },

  setObjectsGroups(state, payload) {
   state.objectsgroups = payload
  },

  updateObject(state, payload) {
   let obj = Object.values(Object.filter(state.objects, el => el.imei == payload.geo.imei))
   state.objects[obj[0].id].geo = payload.geo
  },

  selectObject(state, payload) {
   state.objects[payload.id].selected = payload.value;
  },
  flyToObject(state, payload) {
   state.flyTo = payload
  },
  selectAllObject(store, payload) {
   let objects = store.objects
   for (let obj in objects) {
    objects[obj].selected = payload
   }
  }
 },
 actions: {
  async loadObjects({commit}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    const response = await api.getObjects()
    const item = response.data.data
    commit('setObjects', item.objects)
    commit('setObjectsGroups', item.objectsgroups)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', 'error conection')
    throw error
   }
  },

  async updateSelectedObjectsPositionByImei({commit}, params) {
   console.log(params)
   commit('clearError')
   try {
    const response = await api.getObjectsPositionByImei(params.imei)
    if (response) {
     let items = response.data.data
     for (let i in items) {
      let obj = items[i]
      commit({
       type: 'updateObject',
       geo: obj
      })
     }
    }

   } catch (error) {
    commit('setError', 'нет данных')
    throw error
   }

  },


  selectObject({commit}, payload) {
   commit('selectObject', payload)
  },
  selectAllObject({commit}, payload) {
   commit('selectAllObject', payload)
  },
  flyToObject({commit}, payload) {
   commit('flyToObject', payload)
  },
 },

 getters: {
  getObjects(state) {
   return state.objects
  },

  getObjectsGroups(state) {
   return state.objectsgroups
  },

  getSelectedObjects(state) {
   return Object.filter(state.objects, el => el.selected);
  },

  getSelectedObjectsImei(state, getters) {
   return Object.values(Object.map(getters.getSelectedObjects, el => el.imei));
  },

  getToFly(state,) {
   return state.flyTo
  }
 }
})
