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
   try {
    const response = await api.getUserInfo()
    const items = response.data.data
    commit('setUserInfo', items)
    this.dispatch("getUserPermission");
   } catch (error) {
    commit('setError', 'error user')
    throw error
   }
  },


  getUserPermission({commit, state}) {
   api.getUserPermission().then(response => {
    if (response.status == 200) {
     let items = response.data.data
     commit('setUserPermission', items)
    } else {
     // eventBus.$emit('showmessage', response.data.errors,'error');
     console.errors(response.data);
    }
   }).catch(error => {
    // eventBus.$emit('showmessage', error.data.errors,'error');
    console.error(error)
   })
  },
  clearUserData({commit}) {
   commit('clearUserData')
  }
 }
}