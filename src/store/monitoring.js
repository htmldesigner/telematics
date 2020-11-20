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
   state.objects = Object.values(payload)
   state.objects.forEach(el => {
    el.lastTrack = false
   })
  },

  SETOBJECTSGROUPS(state, payload) {
   state.objectsgroups = Object.values(payload)
  },

  LASTTRACK(state, payload) {
   console.log(payload)
   state.objects.forEach(object => {
    if (+object.id === +payload.id) {
     object.lastTrack = payload.value
    } else {
     object.lastTrack = false
    }
   })
  },

  UPDATEOBJECTPOSITION(state, geo) {
   state.objects.forEach(object => {
    if (object.device_id === geo.device_id) {
     object.geo = geo
    }
   })
  },

  SELECTOBJECT(state, payload) {
   for (let i in state.objects) {
    if (state.objects[i].id === payload.id) {
     state.objects[i].selected = payload.value
    }
   }
  },

  SELECT_OBJECT_GROUP(state, payload) {
   let objId = []
   state.objectsgroups.forEach(el => {
    if (el.id === payload.id) {
     el.selected = payload.value
     objId = el.objects
    }
   })

   for (let i in objId) {
    for (let j in state.objects) {
     if (state.objects[j].id === objId[i] && 'geo' in state.objects[j]) {
      state.objects[j].selected = payload.value
     }
    }
   }
  },


  // ??? Переделать а может и не нужно
  selectAllObject(state, payload) {
   let objects = state.objects
   for (let obj in objects) {
    objects[obj].selected = payload
   }
  },

  MONITOROBJECT(state, payload) {
   state.objects[payload.id].monitor = payload.value;
  },
 },

 actions: {
  async loadObjects({commit, state, dispatch}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    let response = await api.getObjectsWorkSet()
    let item = response.data.data

    commit('SETOBJECTSGROUPS', item.objectsgroups)

    let device_id = await Object.values(item.objects).map((el) => {
     return el.device_id
    })

    let array = device_id
    let size = 250
    let subarray = []
    for (let i = 0; i < Math.ceil(array.length / size); i++) {
     subarray[i] = array.slice((i * size), (i * size) + size)
    }

    if (subarray.length) {
     subarray.forEach(el => {
      this.dispatch('geoHelperLoader', el)
       .then(response => response.data.data)
       .then((response) => {
        if (response !== null) {
         response.forEach((geo) => {
          Object.values(item.objects).forEach(object => {
           if (object.device_id === geo.device_id) {
            object.geo = geo
           }
          })
          commit('SETOBJECTS', item.objects)
         })
        } else {
         commit('SETOBJECTS', item.objects)
        }
       })
     })
    }
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

  async removeFromWorkSet({commit, state}, params) {
   try {
    await api.removeFromWorkset(params)
    state.objects = Object.values(state.objects).filter(el => {
     return el.id !== params[0]
    })
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

  async removeGroupFromWorkSet({commit, state}, params) {
   try {

    state.objectsgroups = state.objectsgroups.filter(el => {
     return el.id !== params[0]
    })

    await api.removeGroupFromWorkset(params)

    let objectsId = []

    state.objectsgroups.forEach(el => {
     el.id === params ? objectsId = el.objects : objectsId = []
    })

    objectsId.forEach(el => {
     remove(el)
    })

    function remove(id) {
     const index = state.objects.findIndex(n => n.id === id);
     if (index !== -1) {
      state.objects.splice(index, 1);
     }
    }

   } catch (error) {
    commit('setError', error)
    throw error
   }
  },

  async getObjectsLastPosition({commit, state}, payload) {
   commit('clearError')
   commit('setLoading', true)
   try {

    let {objectId, groupId} = payload

    if (objectId) {
     this.dispatch('geoDataLoader', objectId)
    }

    if (groupId) {
     let group = state.objectsgroups.filter(el => el.id === groupId).map(el => el.objects)
     group = group.flat()

     let device_id = []
     for (let i in group) {
      for (let j in state.objects) {
       if (state.objects[j].id === group[i]) {
        device_id.push(state.objects[j].device_id)
       }
      }
     }

     this.dispatch('geoDataLoader', device_id)

    }
   } catch (error) {
    commit('setError', error)
    throw error
   }
  },


  async geoHelperLoader({commit}, payload) {
   try {
    if (payload) {
     let geoData = await api.getObjectsPositionByDeviceId(payload)
     return geoData
    }
   } catch (error) {
    commit('setError', error)
    throw error
   }
  },

  async geoDataLoader({commit}, payload) {
   try {
    if (payload) {
     let geoData = await api.getObjectsPositionByDeviceId(payload)
     let geo = geoData.data.data
     if (geo != null) {
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

  /**
   * If enabled checkbox in sittings panel will watch for object in left side dar
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

    let array = device_id //массив, можно использовать массив объектов
    let size = 250 //размер подмассива
    let subarray = []; //массив в который будет выведен результат.
    for (let i = 0; i < Math.ceil(array.length / size); i++) {
     subarray[i] = array.slice((i * size), (i * size) + size);
    }

    if (subarray.length) {
     subarray.forEach(el => {
      this.dispatch('geoDataLoader', el)
     })
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
   commit('MONITOROBJECT', payload)
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
   return state.objects.filter(el => el.selected);
  },

  getMonitorObjects(state) {
   return state.objects.filter(el => el.monitor)
  },

 }
}
