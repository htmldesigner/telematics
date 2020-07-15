export default {
 state: {
  bool_realTime: localStorage.getItem('bool_realTime') != null ? JSON.parse(localStorage.getItem('bool_realTime')) : false,
  int_timerInterval: localStorage.getItem('int_timerInterval') != null ? JSON.parse(localStorage.getItem('int_timerInterval')) : 5,
 },
 mutations: {
  setRealTime(state, payload) {
   state.bool_realTime = payload;
   localStorage.setItem('bool_realTime', JSON.stringify(payload))
  },
  setTimerInterval(state, payload) {
   state.int_timerInterval = payload
   localStorage.setItem('int_timerInterval', payload)
   console.log( state.int_timerInterval)
  },
 },
 actions: {},
 getters: {
  isRealTime: state => {
   return state.bool_realTime;
  },
  getTimerInterval: state => {
   return state.int_timerInterval > 1 ? state.int_timerInterval: 5;
  },


 }
}