import api from "@/app/api"
import axios from "axios";

export default {
 state: {
  objects: [],
  objectsgroups: [],
 },
 mutations: {
  setObjects(state, payload) {
   state.objects = payload
  },

  setObjectsGroups(state, payload) {
   state.objectsgroups = payload
  },

  updateObject(state, payload) {
   let obj = Object.values(Object.filter(state.objects, el => el.imei === payload.geo.imei))
   state.objects[obj[0].id].geo = payload.geo
  },


  REAL_TIME_UPDATE_POSITION(state, payload) {
   let obj = Object.values(Object.filter(state.objects, el => el.id === payload.id))
   state.objects[obj[0].id].geo = payload.geo
  },

  selectObject(state, payload) {
   state.objects[payload.id].selected = payload.value;
  },

  SELECT_OBJECT_GROUP(state, payload) {
   let objId = state.objectsgroups[payload.id].objects
   for (let i in objId) {
    state.objects[objId[i]].selected = payload.value
   }
  },

  // flyToObject(state, payload) {
  //  state.flyTo = payload
  // },

  selectAllObject(state, payload) {
   let objects = state.objects
   for (let obj in objects) {
    objects[obj].selected = payload
   }
  },

  monitorObject(state, payload) {
   state.objects[payload.id].monitor = payload.value;
  },
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

// Realtime update
  async realTimeWatch({commit}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    const response = await api.getObjects()
    const items = response.data.data
    for (let i in items.objects) {
     commit('REAL_TIME_UPDATE_POSITION', items.objects[i])
    }
    commit('setLoading', false)
   } catch (error) {
    commit('setError', 'error conection')
    throw error
   }
  },

// Update selected object is check monitor object
  async updateSelectedObjectsPositionByImei({commit}, params) {
   commit('clearError')
   try {
    const response = await api.getObjectsPositionByImei(params)
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

  // async getObjectsPosition({commit}, params) {
  //  commit('clearError')
  //  try {
  //   const response = await api.getObjectsPosition(params)
  //   if (response) {
  //    let items = response.data.data
  //    for (let i in items) {
  //     let obj = items[i]
  //     commit({
  //      type: 'updateObject',
  //      geo: obj
  //     })
  //    }
  //   }
  //  } catch (error) {
  //   commit('setError', 'нет данных')
  //   throw error
  //  }
  // },


  selectObject({commit}, payload) {
   commit('selectObject', payload)
  },
  selectAllObject({commit}, payload) {
   commit('selectAllObject', payload)
  },
  flyToObject({commit}, payload) {
   commit('flyToObject', payload)
  },
  monitorObject({commit}, payload) {
   commit('monitorObject', payload)
  },

  selectObjectGroup({commit}, payload) {
   commit('SELECT_OBJECT_GROUP', payload)
  }

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

  getMonitorObjects(state) {
   return Object.values(Object.filter(state.objects, el => el.monitor))
  },

 }
}
