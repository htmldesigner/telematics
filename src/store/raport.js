import api from "@/app/api"

export default {
 state: {
  trackGroup: null,
  groupGeoZone: null,
  groupOverSpeed: null,
  geoZoneOverSpeed: null
 },

 mutations: {
  CLEAR_ALL_RAPORT(state, payload) {
   state.trackGroup = payload,
    state.groupGeoZone = payload,
    state.groupOverSpeed = payload,
    state.geoZoneOverSpeed = payload
  },
  /**
   * По движению/стоянкам
   *
   * @param state
   * @param payload
   * @constructor
   */
  SET_TRACK_GROUP(state, payload) {
   state.trackGroup = Array.from(new Set([payload]))
   console.log(state.trackGroup)
  },

  /**
   *Посещение геозон групповое
   *
   * @param state
   * @param payload
   * @constructor
   */
  SET_GROUP_GEOZONE(state, payload) {
   state.groupGeoZone = Array.from(new Set([payload]))
   console.log(state.groupGeoZone)
  },

  /**
   * Превышение скорости групповое
   *
   * @param state
   * @param payload
   * @constructor
   */
  SET_GROUP_OVERSPEED(state, payload) {
   state.groupOverSpeed = Array.from(new Set([payload]))
   console.log(state.groupOverSpeed)
  },

  /**
   * Превышение скорости в геозонах
   *
   * @param state
   * @param payload
   * @constructor
   */
  SET_GEOZONEOVERSPEED(state, payload) {
   state.geoZoneOverSpeed = Array.from(new Set([payload]))
   console.log(state.geoZoneOverSpeed)
  },
 },

 actions: {
  async loadRaport({commit}, query) {
   commit('clearError')
   commit('setLoading', true)
   try {
    let response = await api.serviceQuery(query)

    switch (response.data.data[0].data.report) {

     case "group_overspeed":
      if (response.data.data[0].data?.data.length) {
       commit('SET_GROUP_OVERSPEED', response.data.data[0].data)
      } else {
       commit('setLoading', false)
       commit('setError', 'Ошибка загрузки Превышение скорости групповое')
       return
      }
      break;

     case "track_group":
      if (response.data.data[0].data?.data) {
       commit('SET_TRACK_GROUP', response.data.data[0].data)
      } else {
       commit('setLoading', false)
       commit('setError', 'Ошибка загрузки По движению/стоянкам')
       return
      }
      break;

     case "group_geozone":
      if (response.data.data[0].data?.data) {
       commit('SET_GROUP_GEOZONE', response.data.data[0].data)
      } else {
       commit('setLoading', false)
       commit('setError', 'Ошибка загрузки Посещение геозон групповое')
       return
      }
      break;

     case "geozoneoverspeed":
      if (response.data.data[0].data?.data.length) {

       let getDevice = this.state.monitoring.objects.filter(el => el.id === response.data.data[0].objectId).map(
        el => {
         return {name: el.name, device_id: el.device_id}
        }
       )

       commit('SET_GEOZONEOVERSPEED', Object.assign({}, response.data.data[0].data, ...getDevice.flat()))
      } else {
       commit('setLoading', false)
       commit('setError', 'Ошибка загрузки Превышение скорости в геозонах')
       return
      }
      break;
     default:
      commit('SET_GEOZONEOVERSPEED', null)
      commit('SET_GROUP_GEOZONE', null)
      commit('SET_TRACK_GROUP', null)
      commit('SET_GROUP_OVERSPEED', null)
    }

    commit('clearError')
    commit('setLoading', false)

   } catch (e) {
    commit('setLoading', false)
    commit('setError', 'Ошибка загрузки трека')
   }
  },

  clearAllRaport({commit}) {
   commit('CLEAR_ALL_RAPORT', null)
  }
 },

 getters: {
  getTrackGroup(state) {
   return state.trackGroup
  },
  getGroupGeoZone(state) {
   return state.groupGeoZone
  },
  getGroupOverSpeed(state) {
   return state.groupOverSpeed
  },
  getGeoZoneOverSpeed(state) {
   return state.geoZoneOverSpeed
  }
 },
}