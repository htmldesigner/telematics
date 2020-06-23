import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/js/dist/util.js'
import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import Vuelidate from 'vuelidate'
import '../sass/main.sass'

Vue.use(Vuelidate)

import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Vue.config.productionTip = false



new Vue({
  L,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
