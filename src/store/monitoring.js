import api from "@/app/api"
import Vue from 'vue'
import axios from "axios";

export default {
 state: {
  objects: [],
  objectsgroups: [],
 },
 mutations: {
  SETOBJECTS(state, payload) {
   state.objects = payload;
  },

  SETOBJECTSGROUPS(state, payload) {
   state.objectsgroups = payload
  },

  UPDATEOBJECTPOSITION(state, payload) {
   Object.values(state.objects).forEach(object => {
    if (object.device_id === payload.device_id) {
     object.geo = payload
    }
   })
  },

  REAL_TIME_UPDATE_POSITION(state, payload) {
   let obj = Object.values(Object.filter(state.objects, el => el.id === payload.id))
   state.objects[obj[0].id].geo = payload.geo
  },

  SELECTOBJECT(state, payload) {
   state.objects[payload.id].selected = payload.value
  },


  SELECT_OBJECT_GROUP(state, payload) {
   let objId = state.objectsgroups[payload.id].objects
   for (let i in objId) {
    state.objects[objId[i]].selected = payload.value
   }
  },

  // ??? Переделать а может и не нужно
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
    let response = await api.getObjectsWorkSet()
    let item = response.data.data

    let device_id = Object.values(item.objects).map((el) => {
     return el.device_id
    })

    if (device_id.length) {
     let geoData = await api.getObjectsPositionByDeviceId(device_id)
     let geo = geoData.data.data
     if (geo) {
      geo.forEach((goeData) => {
       Object.values(item.objects).forEach(el => {
        if (el.device_id === goeData.device_id) {
         el.geo = goeData
        }
       })
      })
     }
    }
    commit('SETOBJECTS', item.objects)
    commit('SETOBJECTSGROUPS', item.objectsgroups)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },


  async addToWorkSet({commit}, params) {
   try {
    await api.addToWorkset(params)
   } catch (error) {
    commit('setError', 'error conection')
    throw error
   }
  },

  async removeFromWorkSet({commit}, params) {
   try {
    await api.removeFromWorkset(params)
   } catch (error) {
    commit('setError', error)
    throw error
   }
  },

  async addGroupToWorkSet({commit}, params) {
   try {
    await api.addGroupToWorkset(params)
   } catch (error) {
    commit('setError', error)
    throw error
   }
  },

  async removeGroupFromWorkSet({commit}, params) {
   try {
    await api.removeGroupFromWorkset(params)
   } catch (error) {
    commit('setError', error)
    throw error
   }
  },

// Realtime update
//   async realTimeWatch({commit}) {
//    commit('clearError')
//    commit('setLoading', true)
//    try {
//     const response = await api.getObjects()
//     const items = response.data.data
//     for (let i in items.objects) {
//      commit('REAL_TIME_UPDATE_POSITION', items.objects[i])
//     }
//     commit('setLoading', false)
//    } catch (error) {
//     commit('setError', 'error conection')
//     throw error
//    }
//   },


  /**
   * If enabled checkbox will watch for object in left side dar
   *
   * @param commit
   * @param state
   * @return {Promise<void>}
   */
  async realTimeWatch({commit, state}) {
   try {
    let device_id = Object.values(state.objects).map((el) => {
     return el.device_id
    })
    if (device_id.length) {
     let geoData = await api.getObjectsPositionByDeviceId(device_id)
     let geo = geoData.data.data
     if (geo) {
      geo.forEach((geo) => {
       commit('UPDATEOBJECTPOSITION', geo)
      })
     }
    }
   } catch (error) {
    commit('setError', error)
    throw error
   }
  },

  async selectObject({commit, dispatch}, payload) {
   commit('SELECTOBJECT', payload)
  },

  selectAllObject({commit}, payload) {
   commit('selectAllObject', payload)
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
   // return Object.values(Object.filter(state.objects, el => el.monitor))
  },

 }
}
