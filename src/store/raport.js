import api from "@/app/api"

export default {
 state: {
  trackGroup: null,
  groupGeoZone: null,
  groupOverSpeed: null,
  geoZoneOverSpeed: null,
  mileageshort: null,
  mileagefull: null,
  trackCheck: null,
  trackCheckGroup: null,
  sensorCheck: null,
  sensorCheckGroup: null,
 },

 mutations: {
  CLEAR_ALL_RAPORT(state, payload) {
   state.trackGroup = payload
   state.groupGeoZone = payload
   state.groupOverSpeed = payload
   state.geoZoneOverSpeed = payload
   state.mileageshort = payload
   state.mileagefull = payload

   state.trackCheck = payload
   state.trackCheckGroup = payload
   state.sensorCheck = payload
   state.sensorCheckGroup = payload
  },

  /**
   * Отчет по дискретные сенсорам (групповой)
   *
   * @param state
   * @param payload
   * @constructor
   */
  SET_SENSOR_CHECK_GROUP(state, payload) {
   state.sensorCheckGroup = Array.from(new Set([payload]))
  },


  /**
   * Отчет по дискретные сенсорам
   *
   * @param state
   * @param payload
   * @constructor
   */
  SET_SENSOR_CHECK(state, payload) {
   state.sensorCheck = Array.from(new Set([payload]))
   console.log(state.sensorCheck)
  },

  /**
   * Отчет по работе навигационного оборудования (групповой)
   *
   * @param state
   * @param payload
   * @constructor
   */
  SET_TRACK_CHECK_GROUP(state, payload) {
   state.trackCheckGroup = Array.from(new Set([payload]))
  },

  /**
   * Отчет по работе навигационного оборудования
   *
   * @param state
   * @param payload
   * @constructor
   */
  SET_TRACK_CHECK(state, payload) {
   state.trackCheck = Array.from(new Set([payload]))
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
  },

  SET_MILEAGESHORT(state, payload) {
   state.mileageshort = Array.from(new Set([payload]))
  },

  SET_MILEAGEFULL(state, payload) {
   state.mileagefull = Array.from(new Set([payload]))
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
  },
 },

 actions: {
  async loadRaport({commit}, query) {
   commit('clearError')
   commit('setLoading', true)
   try {
    let response = await api.serviceQuery(query)

    switch (response.data.data[0].data.report) {


     case "track_check":
      if (response.data.data[0].data?.data.length) {
       commit('SET_TRACK_CHECK', response.data.data[0].data)
      } else {
       commit('setLoading', false)
       commit('setError', 'Отчет по работе навигационного оборудования')
       return
      }
      break;


     case "track_checkgroup":
      if (response.data.data[0].data?.data.length) {
       commit('SET_TRACK_CHECK_GROUP', response.data.data[0].data)
      } else {
       commit('setLoading', false)
       commit('setError', 'Отчет по работе навигационного оборудования (Групповой)')
       return
      }
      break;

     case "sensor_check":
      if (response.data.data[0].data?.data.length) {
       commit('SET_SENSOR_CHECK', response.data.data[0].data)
      } else {
       commit('setLoading', false)
       commit('setError', 'отчет по дискретные сенсорам')
       return
      }
      break;

     case "sensor_checkgroup":
      if (response.data.data[0].data?.data.length) {
       commit('SET_SENSOR_CHECK_GROUP', response.data.data[0].data)
      } else {
       commit('setLoading', false)
       commit('setError', 'Отчет по дискретные сенсорам (групповой)')
       return
      }
      break;



     case "mileageshort":
      if (response.data.data[0].data?.data.length) {
       commit('SET_MILEAGESHORT', response.data.data[0].data)
      } else {
       commit('setLoading', false)
       commit('setError', 'Ошибка загрузки По пробегу (короткий)')
       return
      }
      break;

     case "mileagefull":
      if (response.data.data[0].data?.data.length) {
       commit('SET_MILEAGEFULL', response.data.data[0].data)
      } else {
       commit('setLoading', false)
       commit('setError', 'Ошибка загрузки По пробегу (Полный)')
       return
      }
      break;

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
      commit('SET_MILEAGESHORT', null)
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
  },
  getMileageShort(state) {
   return state.mileageshort
  },
  getMileageFull(state) {
   return state.mileagefull
  },

  getTrackCheck(state) {
   return state.trackCheck
  },
  getTrackCheckGroup(state) {
   return state.trackCheckGroup
  },
  getSensorCheck(state) {
   return state.sensorCheck
  },
  getSensorCheckGroup(state) {
   return state.sensorCheckGroup
  }

 },
}