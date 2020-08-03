import api from "@/app/api"

export default {
 state: {
  tracks: [],
 },
 mutations: {
  addTrack(state, payload) {
   state.tracks.push(payload);
   console.log(state.tracks)
  }
 },
 actions: {
  async loadTracks({commit, getters}, {query, id}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    let queryLayers = {};
    queryLayers.info = {}

    let request = await api.serviceQuery(query)
    let response = request.data.data
    for (let i in getters.getObjects) {
     if (getters.getObjects[i].id === id) {
      queryLayers.info.name = getters.getObjects[i].name
      queryLayers.info.id = getters.getObjects[i].id
      queryLayers.info.imei = getters.getObjects[i].imei
      queryLayers.info.reg_number = getters.getObjects[i].reg_number
      queryLayers.info.play = false
     }
    }

    queryLayers.data = response

    commit('addTrack', queryLayers)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', 'error loading tracks')
    throw error
   }
  }
  // async loadTracksFor({commit, state}, params) {
  //  try {
  //   let response = await api.getTracksForv2(params.ids, params.dateFrom, params.dateTo, params.speedLimit)
  //   if (response) {
  //    let items = response.data.data
  //    if (items == "") {
  //     items = [];
  //    }
  //    items.forEach(item => {
  //     if (item.playback.length > 0) {
  //      commit('addTrack', item)
  //     } else {
  //      commit('setError', 'Не найдены данные для указанного интервала для объекта ' + item.obj.name);
  //     }
  //    });
  //   }
  //  } catch (e) {
  //   throw e
  //  }
  // },
 },
 getters: {
  getTracks(state) {
   return state.tracks
  },
 }
}