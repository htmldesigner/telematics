import { L } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import vuetify from './plugins/vuetify';

import VueSplit from 'vue-split-panel'
Vue.use(VueSplit)

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
  vuetify,
  render: h => h(App)
}).$mount('#app')
