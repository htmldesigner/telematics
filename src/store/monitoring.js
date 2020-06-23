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
    let response = await api.getObjects()
    let item = response.data
    // console.log(response.data)
    commit('setObjects', item.objects)
    commit('setObjectsGroups', item.objectsgroups)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', 'error conection')
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
   return  state.objectsgroups
  },
  getToFly(state) {
   return state.flyTo
  }
 }
})
