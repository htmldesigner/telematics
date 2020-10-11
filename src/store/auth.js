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
  login({commit}, user){
   return new Promise((resolve, reject) => {
    axios({url: 'http://telematics.checkedout.kz/api/mobile/authorization', data: user, method: 'POST' })
     .then(resp => {

      const token = resp.data.data.usertoken
      // const user = resp.data.user
      const user = resp.data.data.usertoken
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = token //?

      commit('AUTH_SUCCESS', token, user)

      resolve(resp)

     })
     .catch(err => {
      console.log('error')
      localStorage.removeItem('token')
      reject(err)
     })
   })
  },

  logout({commit}){
   return new Promise((resolve, reject) => {
    commit('LOGOUT')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
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