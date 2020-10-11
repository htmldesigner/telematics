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

  UPDATEOBJECT(state, payload) {
   let obj = Object.values(Object.filter(state.objects, el => el.device_id === payload.device_id))
   state.objects[obj[0].id].geo = payload
  },

  REAL_TIME_UPDATE_POSITION(state, payload) {
   let obj = Object.values(Object.filter(state.objects, el => el.id === payload.id))
   state.objects[obj[0].id].geo = payload.geo
  },

  SELECTOBJECT(state, payload) {
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
  loadObjects({commit}) {
   commit('clearError')
   commit('setLoading', true)
   api.getObjects()
    .then(
    response => response.data.data
   ).then(item => {
    commit('SETOBJECTS', item.objects)
    commit('SETOBJECTSGROUPS', item.objectsgroups)
    console.log('t')
    commit('setLoading', false)
   })
    .catch((error) => {
     commit('setLoading', false)
     commit('setError', error)
     throw error
   })



   // commit('clearError')
   // commit('setLoading', true)
   // try {
   //
   //  const response = await api.getObjects()
   //  console.log('loadObjects')
   //  const item = response.data.data
   //
   //  // const device_id = Object.values(Object.map(item.objects, el => el.device_id))
   //  //
   //  // const geoData = await api.getObjectsPositionByDeviceId(device_id)
   //  // const geos = geoData.data.data
   //  //
   //  // for (let i in item.objects){
   //  //  for (let j in geos){
   //  //   if (item.objects[i].device_id === geos[j].device_id){
   //  //    item.objects[i].geo = geos[j]
   //  //   }
   //  //  }
   //  // }
   //  console.log('loadObjects mut')
   //  commit('SETOBJECTS', item.objects)
   //  commit('SETOBJECTSGROUPS', item.objectsgroups)
   //  console.log('loadObjects end')
   //  commit('setLoading', false)
   // } catch (error) {
   //  commit('setLoading', false)
   //  commit('setError', 'error conection')
   //  throw error
   // }
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
//   async updateSelectedObjectsPositionByImei({commit}, params) {
//    commit('clearError')
//    try {
//     const response = await api.getObjectsPositionByImei(params)
//     if (response) {
//      let items = response.data.data
//      for (let i in items) {
//       let obj = items[i]
//       commit({
//        type: 'updateObject',
//        geo: obj
//       })
//      }
//     }
//    } catch (error) {
//     commit('setError', 'нет данных')
//     throw error
//    }
//   },

  async updateSelectedObjectsPositionByDeviceId({commit, state}, params) {
   const response = await api.getObjectsPositionByDeviceId(params)
   commit('clearError')
   commit('setLoading', true)
   try {
    if (response) {
     let items =  response.data.data
     for (let i in items){
      let geo = items[i]
     commit('UPDATEOBJECT', geo)
     }
    }
    commit('setLoading', false)
   } catch (error) {
    commit('setError', 'нет данных' + error)
    throw error
   }
  },


 async selectObject({commit, dispatch}, payload) {
   commit('SELECTOBJECT', payload)
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
