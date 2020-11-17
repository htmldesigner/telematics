import api from "@/app/api"
import moment from 'moment'

export default {

 state: {
  /**
   * Save current component
   */
  currentComponent: localStorage.getItem('str_current') != null ? JSON.parse(localStorage.getItem('str_current')) : "monitoring",

  /**
   * Save panel spliter position
   */
  paneSize: localStorage.getItem('paneSize') != null ? JSON.parse(localStorage.getItem('paneSize')) : 20,

  /**
   * Set time for track loader
   */
  long_timeIntervalStart: localStorage.getItem('long_timeIntervalStart') != null ? JSON.parse(localStorage.getItem('long_timeIntervalStart')) :  moment(Date.now()).subtract(1, 'd').format("YYYY-MM-DDTHH:mm"),
  long_timeIntervalEnd: localStorage.getItem('long_timeIntervalEnd') != null ? JSON.parse(localStorage.getItem('long_timeIntervalEnd')) : moment().format("YYYY-MM-DDTHH:mm"),

  speedLimits: null,

  /**
   * Realtime watcher activate
   */
  bool_realTime: null,

  /**
   * Minimum over speed in seconds
   */
  int_overSpeedMinDuration: null,

  /**
   * Time update realtime watcher
   */
  int_timerInterval: null,

  /**
   * Parking radius
   */
  int_stopMinRadius: null,

  /**
   * Minimum parking time
   */
  int_stopMinDuration: null,

  /**
   * Minimum time spent in the geo zone
   */
  int_geoZoneVisitMinDuration: null,

  /**
   * Minimum travel time
   */
  int_trackMinDuration: null,

  mapZoom: localStorage.getItem('map_Zoom'),
  mapCenter: localStorage.getItem('map_Center'),

 },
 mutations: {
  /**
   * Set map zoom
   *
   * @param state
   * @param payload
   * @constructor
   */
  SETMAPZOOM(state, payload){
   localStorage.setItem('map_Zoom', JSON.stringify(payload))
  },

  /**
   * Set map center
   *
   * @param state
   * @param payload
   * @constructor
   */
  SETMAPCENTER(state, payload){
   localStorage.setItem('map_Center', JSON.stringify(payload))
  },


  /**
   * Set speed limits also speed color
   *
   * @param state
   * @param payload
   */
  SETSPEEDLIMITS(state, payload) {
   state.speedLimits = payload
  },

  /**
   * Set time interval for request
   *
   * @param state
   * @param payload
   */
  SETTIMEINTERVALSTART(state, payload) {
   state.long_timeIntervalStart = payload
   localStorage.setItem('long_timeIntervalStart', JSON.stringify(payload))
  },

  SETTIMEINTERVALEND(state, payload) {
   state.long_timeIntervalEnd = payload
   localStorage.setItem('long_timeIntervalEnd', JSON.stringify(payload))
  },

  /**
   *  Set turn on, turn off update object in realtime
   *
   * @param state
   * @param payload
   * @return boolean
   */
  SETREALTIME(state, payload) {
   state.bool_realTime = Boolean(payload)
  },

  /**
   * Set time for realtime watcher
   *
   * @param state
   * @param payload
   *
   */
  SETTIMERINTERVAL(state, payload) {
   state.int_timerInterval = Number(payload)
  },

  /**
   * Set value minimal over speed in seconds
   */
  SETOVERSPEEDMINDURATION(state, payload) {
   state.int_overSpeedMinDuration = Number(payload)
  },

  /**
   * Set value minimal over speed in seconds
   */
  SETSTOPMINDURATION(state, payload) {
   state.int_stopMinDuration = Number(payload)
  },

  /**
   * Set value minimal over speed in seconds
   */
  SETSTOPMINRADIUS(state, payload) {
   state.int_stopMinRadius = Number(payload)
  },

  SETTRACKMINDURATION(state, payload) {
   state.int_trackMinDuration = Number(payload)
  },

  SETGEOZONEVISITMINDURATION(state, payload) {
   state.int_geoZoneVisitMinDuration = Number(payload)
  },

  /**
   * Save pane size
   *
   * @param state
   * @param payload
   */
  SETPANESIZE(state, payload) {
   state.paneSize = payload;
   localStorage.setItem('paneSize', JSON.stringify(payload))
  },

  /**
   * Save current component
   *
   * @param state
   * @param payload
   */
  SETCURRENTCOMPONENT(state, payload) {
   state.currentComponent = payload
   localStorage.setItem('str_current', JSON.stringify(payload))
  },

 },
 actions: {

  saveState({commit}, savedstate) {
   return api.saveState(savedstate);
  },

  async loadState({commit}) {
   const response = await api.loadState()
   let data = await JSON.parse(response.data.data)
   commit('SETSPEEDLIMITS', data.speedindex)
   commit('SETREALTIME', data.isRealTime)
   commit('SETTIMERINTERVAL', data.timerInterval)
   commit('SETOVERSPEEDMINDURATION', data.overSpeedMinduration)
   commit('SETSTOPMINRADIUS', data.stopMinradius)
   commit('SETSTOPMINDURATION', data.stopMinduration)
   commit('SETTRACKMINDURATION', data.trackMinduration)
   commit('SETGEOZONEVISITMINDURATION', data.geozoneVisitMinduration)

  },

 },
 getters: {
  isRealTime: state => {
   return state.bool_realTime;
  },

  getTimeIntervalStart: state => {
   return state.long_timeIntervalStart;
  },

  getTimeIntervalEnd: state => {
   return state.long_timeIntervalEnd;
  },

  getTimerInterval: state => {
   return state.int_timerInterval > 1 ? state.int_timerInterval : 5;
  },

  getOverSpeedMinDuration: state => {
   return state.int_overSpeedMinDuration != null ? state.int_overSpeedMinDuration : 2;
  },

  getSpeedLimits: state => state.speedLimits,

  getStopMinRadius: state => {
   return state.int_stopMinRadius > 1 ? state.int_stopMinRadius : 30;
  },

  getGeoZoneVisitMinDuration: state => {
   return state.int_geoZoneVisitMinDuration > 1 ? state.int_geoZoneVisitMinDuration : 120;
  },

  getTrackMinDuration: state => {
   return state.int_trackMinDuration > 1 ? state.int_trackMinDuration : 120;
  },

  getStopMinDuration: state => {
   return state.int_stopMinDuration > 1 ? state.int_stopMinDuration : 2;
  },

  getPaneSize: state => {
   return state.paneSize
  },

  getCurrentComponent(state) {
   return state.currentComponent
  },

  // getSpeedLimitsColor: state => state.speedLimits.map(sp => sp.color),
  //
  getSpeedLimitsValue: state => state.speedLimits.map(sp => parseInt(sp.speed)),

  getMapZoom: state => {
   return state.mapZoom
  },

  getMapCenter: state => {
   return JSON.parse(state.mapCenter)
  }

 }
}