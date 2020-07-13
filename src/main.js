// import utils from './utils'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/js/dist/util.js'
import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import Vuelidate from 'vuelidate'
import '../sass/main.sass'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import RotatedMarker from 'leaflet-rotatedmarker'
Vue.use(Vuelidate)
Vue.use(RotatedMarker)
// Vue.prototype.$utils = utils

Vue.config.productionTip = false

new Vue({
  L,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
