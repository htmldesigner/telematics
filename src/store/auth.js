import api from "@/app/api"
import axios from "axios";

export default {
 state: {
  status: '',
  token: localStorage.getItem('token') || '',
  user: localStorage.getItem('token') || null,
 },
 mutations: {
  AUTH_SUCCESS(state, token, user){
   state.status = 'success'
   state.token = token
   state.user = user
  },

  LOGOUT(state){
   state.status = ''
   state.token = ''
   state.user = null
  },
 },

 actions: {
  async login({commit}, user){
   try {
    const response = await api.auth(user)
    if(response.status === 200){
     const token = await response.data.data.usertoken
     const user = await response.data.data.usertoken
     await localStorage.setItem('token', token)
     axios.defaults.headers.common['Token'] = token
     commit('AUTH_SUCCESS', token, user)
    }
   }catch (error) {
    localStorage.removeItem('token')
    throw error
   }
  },

  logout({commit}){
   return new Promise((resolve, reject) => {
    commit('LOGOUT')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Token']
    resolve()
   })
  }

 },

 getters: {
  isUserLoggedIn(state) {
   return state.user !== null
  }

 },
}