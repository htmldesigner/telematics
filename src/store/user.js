import axios from "axios";

class User {
 constructor(id) {
  this.id = id
 }
}

export default {
 state: {
  user: null,
  token: localStorage.getItem('user') || '',
 },
 mutations: {
  setUser(state, payload) {
   state.user = payload
  }
 },
 actions: {
  async registerUser({commit}, {email, password}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    commit('setUser', payload)
    commit('setLoading', false)
   } catch (error) {
    commit('setLoading', false)
    commit('setError', payload)
    throw error
   }
  },
  async loginUser({commit}, {login, password}) {
   commit('clearError')
   commit('setLoading', true)
   try {
    const response = await axios({
     method: 'post',
     url: 'http://telematics.checkedout.kz/api/mobile/authorization',
     headers: {
      'Content-Type': 'application/json',
     },
     data: {
      login: login,
      password: password
     },
    })
    const user = response.data
    if (user){
     commit('setUser', user)
     localStorage.setItem('user', JSON.stringify(user))
     commit('setLoading', false)
    }
   } catch (error) {
    commit('setLoading', false)
    commit('setError', error.response.data.errors)
    localStorage.removeItem('user')
    throw error
   }

  },
  autoLoginUser({commit, state}, payload) {

  },

  logOut({commit}) {
   localStorage.removeItem('user')
   commit('setUser', null)
  }

 },
 getters: {
  user(state) {
   return state.user
  },
  isUserLoggedIn(state) {
   return state.user !== null
  }
 }
}