import api from "@/app/api"
import Vue from 'vue'
import {eventBus} from "../eventBus";

export default {
 state: {
  userInfo: {},
  userPermission: []
 },
 getters: {
  getUserInfo: state => state.userInfo,
  getUserPermission: state => state.userPermission,
  checkPermission: (state) => (type, itemid, permission) => {
   if (state.userPermission.indexOf(type + "." + itemid + "." + permission) != -1) {
    return true;
   }
   return false;
  }
 },
 mutations: {
  setUserInfo(state, payload) {
   state.userInfo = payload;
  },
  setUserPermission(state, payload) {
   state.userPermission = payload;
  },
  clearUserData(state) {
   state.userInfo = {}
   state.userPermission = {}
  }
 },
 actions: {
  async getUserInfo({commit}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    const response = await api.getUserInfo()
    this.dispatch("getUserPermission");
    const items = response.data.data
    commit('setUserInfo', items)
    commit('setLoading', false)
   } catch (error) {
    commit('setError', 'error user')
    throw error
   }
  },

  async getUserPermission({commit}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    const response = await api.getUserPermission()
    const items = response.data.data
    commit('setUserPermission', items)
    commit('setLoading', false)
   } catch (error) {
    commit('setError', 'error user')
    throw error
   }
  },

  clearUserData({commit}) {
   commit('clearUserData')
  }
 }
}