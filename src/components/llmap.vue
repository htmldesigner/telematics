<template>
 <l-map
  :zoom="zoom"
  :center="defaultCenter"
  ref="map"
  :options="{zoomControl: false}"
 >

  <v-rotated-marker
   v-if="object.selected"
   v-for="(object, index) in objects"
   :key="index"
   :lat-lng="latLng(object.geo.latitude, object.geo.longitude)"
   :icon="arrowicon"
   :rotationAngle="object.geo.course">
   <l-popup>
    <table>
     <tr>
      <td>{{object.name}}</td>
     </tr>
     <tr>
      <td>{{object.geo.speed}}</td>
     </tr>

     <tr>
      <td>{{object.geo.course}}</td>
     </tr>
    </table>
   </l-popup>


   <l-tooltip>

    <table>
     <tr>
      <td>{{object.name}}</td>
     </tr>
     <tr>
      <td>{{object.geo.speed}}</td>
     </tr>
     <tr>
      <td>{{object.geo.course}}</td>
     </tr>
    </table>

   </l-tooltip>

  </v-rotated-marker>


  <l-tile-layer
   :url="url"
   :attribution="attribution"
  />
  <l-control-zoom position="bottomright"></l-control-zoom>
 </l-map>
</template>

<script>
 import Vue2LeafletRotatedMarker from 'vue2-leaflet-rotatedmarker'
 import {latLng, icon} from "leaflet";
 import {LMap, LTileLayer, LControl, LControlZoom, LMarker, LPopup, LTooltip, LIcon} from "vue2-leaflet";
 import {mapGetters} from 'vuex';

 export default {
  name: "Example",
  components: {
   'v-rotated-marker': Vue2LeafletRotatedMarker,
   LMap,
   LTileLayer,
   LControl,
   LControlZoom,
   LMarker,
   LPopup,
   LTooltip,
   LIcon
  },
  data() {
   return {
    marker: '',
    zoom: 10,

    icon: icon({
     iconUrl: "http://leafletjs.com/examples/custom-icons/leaf-green.png",
     iconSize: [32, 37],
     iconAnchor: [16, 37]
    }),

    arrowicon: icon({
     iconUrl: '/img/navigator64.png',
     shadowUrl: 'https://hst-api.wialon.com/avl_library_image/5/0/library/unit/A_11.png?b=16&amp;v=1&amp;sid=09b694edc6d76332da3bbc20210f9aa0',
     iconSize: [25, 25],
     iconAnchor: [8, 8],

     shadowAnchor: [-25, 12],
     shadowSize:   [25, 25],
    }),

    defaultCenter: [51.7971, 55.1137],
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
   };
  },
  computed: {
   ...mapGetters({
    objects: 'getObjects',
    flyTo: 'getToFly'
   }),
  },
  watch: {
   flyTo() {
    this.$refs.map.mapObject.flyTo([this.flyTo.geo.latitude, this.flyTo.geo.longitude])
   }
  },
  methods: {
   latLng(lat, Lng) {
    return L.latLng(lat, Lng)
   },
   onResize() {
    setTimeout(() => {
     this.$refs.map.mapObject.invalidateSize();
    }, 400);
   }
  },
  mounted() {
   this.onResize()
   document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';
  }
 };
</script>

<style scoped>


</style>
