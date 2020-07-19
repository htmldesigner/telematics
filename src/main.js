import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import Vuelidate from 'vuelidate'
import utils from './utils'
import RotatedMarker from 'leaflet-rotatedmarker'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/js/dist/util.js'
import '../sass/main.sass'
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css"

// const moment = require('moment')
import moment from 'moment';
require('moment/locale/ru')
Vue.use(require('vue-moment'), {moment})
Vue.use(require('vue-moment'))

Vue.use(Vuelidate)
Vue.use(RotatedMarker)

Vue.prototype.$utils = utils

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
