import api from "@/app/api"

export default {
 state: {
  geozones: [],
  geozonesgroups: [],
  modifiablegeozone: [],
  selectedGeozone: []
 },

 mutations: {
  /**
   * Set group geo zone
   *
   * @param state
   * @param payload
   */
  SETGEOZONESGROUPS(state, payload) {
   state.geozonesgroups = payload;
  },

  /**
   * Set geo zone object
   *
   * @param state
   * @param payload
   */
  SETGEOZONES(state, payload) {
   state.geozones = payload;
  },

  /**
   * Set midifiable geo zone oblect
   *
   * @param state
   * @param payload
   */
  MODIFIABLE_GEOZONE(state, payload) {
   state.modifiablegeozone = payload
  },

  /**
   * Select goe zone one or all
   *
   * @param state
   * @param payload
   */
  SELECTED_GEOZONE(state, payload) {
   if (Array.isArray(payload)) {
    payload.forEach(el => {
     el.selected = true, state.selectedGeozone.push(el)
    })

   } else {
    payload.selected = true
    state.selectedGeozone.push(payload)
   }
  },

  /**
   * Unselect goe zone one or all
   *
   * @param state
   * @param payload
   */
  UNSELECT_GEOZONE(state, payload) {
   if (Array.isArray(payload)) {
    payload.forEach(id => {
     state.selectedGeozone = state.selectedGeozone.filter(el => el.id !== id)
    })
   } else {
    state.selectedGeozone = state.selectedGeozone.filter(el => el.id !== payload)
   }
  }

 },
 actions: {
  async loadGeozones({commit, state}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    const response = await api.getGeozonesWorkSet()
    const items = response.data.data
    state.selectedGeozone = []
    commit('SETGEOZONESGROUPS', items.geozonesgroups)
    commit('SETGEOZONES', items.geozones)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', `Нет объектов ${error}`)
    throw error
   }
  },

  saveGeozones({commit, state}, params) {
   return Promise.resolve(api.saveGeozoneGeometry(params.id, params.layersData).then(response => {
    if (response.status == 200) {
    } else {
     console.errors(response.data);
     commit('setError', 'error conection')
    }
   }).catch(error => {
    commit('setError', error)
   }));
  },

  /**
   * Load selected goe zone
   * @param commit
   * @param id
   * @return {Promise<void>}
   */
  async getSelectedGeozone({commit}, id) {
   commit('clearError')
   try {
    const response = await api.getGeozone(id)
    const items = response.data.data
    commit('SELECTED_GEOZONE', items)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', 'Нет данных')
   }
  },

  async getModifiableGeozone({commit}, id) {
   commit('clearError')
   try {
    const response = await api.getGeozone(id)
    const items = response.data.data
    commit('MODIFIABLE_GEOZONE', items)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error)
    throw error
   }
  },

  /**
   * Load selected geo zone group
   *
   * @param commit
   * @param id
   * @return {Promise<void>}
   */
  async getSelectedGeozoneGroup({commit}, id) {
   commit('clearError')
   try {
    const response = await api.getGeozonesTree(id)
    const items = response.data.data
    commit('SELECTED_GEOZONE', items)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', 'Не содержит объекты')
    throw error
   }
  },

  unselectGeozone({commit}, id) {
   commit('UNSELECT_GEOZONE', id)
  },


  async addGeoZoneToWorkSet({commit, state}, params) {
   try {
    await api.addGeozoneToWorkset(params)
   } catch (error) {
    commit('setError', 'error conection')
    throw error
   }
  },

  async removeGeoZoneFromWorkSet({commit, state}, params) {
   try {
    await api.removeGeozoneFromWorkset(params)
    state.geozones = Object.values(state.geozones).filter(el => {
     return el.id !== params[0]
    })
   } catch (error) {
    commit('setError', error)
    throw error
   }
  },

  async addGroupGeoZoneToWorkSet({commit}, params) {
   try {
    await api.addGeozoneGroupToWorkset(params)
   } catch (error) {
    commit('setError', error)
    throw error
   }
  },

  async removeGroupGeoZoneFromWorkSet({commit, state}, params) {
   try {

    state.geozonesgroups = state.geozonesgroups.filter(el => {
     return el.id !== params[0]
    })

    await api.removeGeozoneGroupFromWorkset(params)

    let objectsId = []

    state.geozonesgroups.forEach(el => {
     el.id === params ? objectsId = el.geozones : objectsId = []
    })

    objectsId.forEach(el => {
     remove(el)
    })

    function remove(id) {
     const index = state.geozones.findIndex(n => n.id === id);
     if (index !== -1) {
      state.objects.splice(index, 1);
     }
    }

   } catch (error) {
    commit('setError', error)
    throw error
   }
  },


 },

 getters: {
  getGeozonesGroups: state => state.geozonesgroups,
  getGeozones: state => state.geozones,
  selectedGeozone: state => state.selectedGeozone,
  getModifiableGeozone: state => state.modifiablegeozone
 },


}