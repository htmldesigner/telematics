import moment from 'moment'
export default {
 state: {
  //component
  currentComponent: localStorage.getItem('str_current') != null ? JSON.parse(localStorage.getItem('str_current')) : "monitoring",
  //panel spliter
  paneSize: localStorage.getItem('paneSize') != null ? JSON.parse(localStorage.getItem('paneSize')) : 20,
  //Realtime watcher
  bool_realTime: localStorage.getItem('bool_realTime') != null ? JSON.parse(localStorage.getItem('bool_realTime')) : false,
  //Update interval
  int_timerInterval: localStorage.getItem('int_timerInterval') != null ? JSON.parse(localStorage.getItem('int_timerInterval')) : 5,
 //Set tima for track loader
  long_timeIntervalStart: localStorage.getItem('long_timeIntervalStart') != null ? JSON.parse(localStorage.getItem('long_timeIntervalStart')) : moment().subtract(1200, 'days').format("YYYY-MM-DDTHH:mm"),
  long_timeIntervalEnd: localStorage.getItem('long_timeIntervalEnd') != null ? JSON.parse(localStorage.getItem('long_timeIntervalEnd')) : moment().format("YYYY-MM-DDTHH:mm"),

 },
 mutations: {

  setRealTime(state, payload) {
   state.bool_realTime = payload;
   localStorage.setItem('bool_realTime', JSON.stringify(payload))
  },

  setTimerInterval(state, payload) {
   state.int_timerInterval = payload
   localStorage.setItem('int_timerInterval', payload)
  },

  setTimeIntervalStart(state, payload) {
   state.long_timeIntervalStart = payload
   localStorage.setItem('long_timeIntervalStart', JSON.stringify(payload))
  },
  setTimeIntervalEnd(state, payload) {
   state.long_timeIntervalEnd = payload
   localStorage.setItem('long_timeIntervalEnd', JSON.stringify(payload))
  },

  setPaneSize(state, payload){
   state.paneSize = payload;
   localStorage.setItem('paneSize', JSON.stringify(payload))
  },

  setCurrentComponent(state, payload){
   state.currentComponent = payload
   localStorage.setItem('str_current', JSON.stringify(payload))
  }

 },
 actions: {},
 getters: {
  isRealTime: state => {
   return state.bool_realTime;
  },
  getTimerInterval: state => {
   return state.int_timerInterval > 1 ? state.int_timerInterval: 5;
  },

  getTimeIntervalStart: state => {
   return state.long_timeIntervalStart;
  },
  getTimeIntervalEnd: state => {
   return state.long_timeIntervalEnd;
  },

  getPaneSize: state => {
   return state.paneSize
  },

  getCurrentComponent(state){
   return state.currentComponent
  }

 }
}