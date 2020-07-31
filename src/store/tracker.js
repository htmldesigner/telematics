import api from "@/app/api"

export default {
 state: {
  tracks: [],
 },
 mutations: {
  // addTrack(state, payload) {
  //  state.tracks.push(payload);
  //  console.log(state.tracks)
  // }
 },
 actions: {
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
  // getTracks(state) {
  //  return state.tracks
  // },
 }
}