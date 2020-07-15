import api from "@/app/api"
import axios from "axios";

export default ({
 state: {
  objects: [],
  objectsgroups: [],
  tracks: [],
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

  flyToObject(state, payload) {
   state.flyTo = payload
  },

  selectAllObject(store, payload) {
   let objects = store.objects
   for (let obj in objects) {
    objects[obj].selected = payload
   }
  },

  monitorObject(state, payload) {
   state.objects[payload.id].monitor = payload.value;
  },

  addTrack(state, payload) {
   state.tracks = payload;
   console.log(state.tracks)
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
   try {
    const response = await api.getObjects()
    const items = response.data.data
    for (let i in items.objects) {
     commit('REAL_TIME_UPDATE_POSITION', items.objects[i])
    }
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


  async loadTracksFor({ commit, state }, params) {
   return Promise.resolve(api.getTracksForv2(params.ids, params.dateFrom, params.dateTo, params.speedLimit).then(response => {
     if (response.status == 200) {
      let items = response.data.data
      if (items == "") {
       items = [];
      }
      commit('clearError')
      items.forEach(item => {
       // console.log(item);
       if (item.playback.length > 0) {
        commit('addTrack', item)
       } else {
        commit('setError', 'Не найдены данные для указанного интервала для объекта ' + item.obj.name)
       }
      });
     }else{
      console.errors(response.data);
     }
    }).catch(error => { console.error(error) })
   );
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

  getTracks: state => state.tracks,
 }
})
