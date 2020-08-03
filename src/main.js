import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import Vuelidate from 'vuelidate'

import './utils/LeafletPlayback'
import RotatedMarker from 'leaflet-rotatedmarker'


import 'primevue/resources/themes/nova/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import InputText from 'primevue/inputtext';
import Slider from 'primevue/slider';
import TreeTable from 'primevue/treetable';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Row from 'primevue/row';
import ColumnGroup from 'primevue/columngroup';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';

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

Vue.component('Slider', Slider);
Vue.component('TreeTable', TreeTable);
Vue.component('DataTable', DataTable);
Vue.component('Row', Row);
Vue.component('Dropdown', Dropdown);
Vue.component('Column', Column);
Vue.component('ColumnGroup', ColumnGroup);
// Vue.component('Button', Button);
Vue.component('InputText', InputText);
Vue.component('Checkbox', Checkbox);

// Vue.prototype.$utils = utils
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
