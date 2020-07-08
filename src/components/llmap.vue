<template>
 <div class="rel">
  <div ref="mapContainer" id="mapContainer" class="l-map"></div>
 </div>
</template>

<script>
 import 'leaflet/dist/leaflet.css'
 import L from 'leaflet'
 import RotatedMarker from 'leaflet-rotatedmarker'
 // BUG https://github.com/Leaflet/Leaflet/issues/4968
 import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
 import iconUrl from 'leaflet/dist/images/marker-icon.png'
 import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
 import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';

 export default {
  name: "llmap",
  components: {
   RotatedMarker
  },
  data() {
   return {
    map: null,
    arrowicon: L.icon({
     iconUrl: '/img/navigator64.png',
     iconSize: [32, 32],
     iconAnchor: [16, 16]
    }),
    markers: []
   };
  },
  computed: {
   ...mapGetters({
    objects: 'getObjects',
    selectedObjects: 'getSelectedObjects',
    getFly: 'getToFly'
   }),
  },
  watch: {
   objects: {
    handler(newValue) {
     this.addMarker(newValue)
    },
    deep: true,
   },
   getFly: {
    handler(point){
     this.moveToMarker(point)
    }
   }
  },
  methods: {
   fixBug() {
    // https://github.com/Leaflet/Leaflet/issues/4968
    L.Marker.prototype.options.icon = L.icon({
     iconRetinaUrl,
     iconUrl,
     shadowUrl,
     iconSize: [25, 41],
     iconAnchor: [12, 41],
     popupAnchor: [1, -34],
     tooltipAnchor: [16, -28],
     shadowSize: [41, 41]
    })
   },

   createMapInstance() {
    this.map = L.map(this.$refs.mapContainer, {preferCanvas: true}).setView([51.7971, 55.1137], 4)
    const spinalLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom: 18,
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    const osmLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
     attribution: '&copy; <a href="copyright">Openstreetmap</a>'
    })
    setTimeout(() => {
     this.map.invalidateSize();
    }, 400)
    document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';
    const baseMaps = {
     OSM: osmLayer,
     Spinal: spinalLayer,
    };
    L.control.layers(baseMaps).addTo(this.map)
    this.map.addLayer(spinalLayer)
   },

   //
   // latLng(lat, Lng) {
   //  return new L.latLng(lat, Lng)
   // },

   addMarker(newValue) {
    for (let i in this.markers) {
     this.map.removeLayer(this.markers[i])
    }
    this.markers = []
    for (let i in newValue) {
     if (newValue[i].selected) {
      const marker = L.marker(new L.LatLng(newValue[i].geo.latitude, newValue[i].geo.latitude),
       {
        rotationAngle: newValue[i].geo.course,
        icon: this.arrowicon
       })

      this.markers.push(marker)

    function customTip() {
     this.unbindTooltip();
     if (!this.isPopupOpen()) {
      this.bindTooltip(`
        <h5>${newValue[i].name}</h5><span>${newValue[i].geo.fix_date}</span>
        <br/><span>${newValue[i].reg_number}</span>
        <br><span>${newValue[i].imei}</span>
        `,
       {className: "custom-tooltips", interactive: true}).openTooltip();
     }
    }

      function customPop() {
       this.unbindTooltip();
      }

      this.map.addLayer(marker.bindPopup('доп функции', {className: "custom-popup"}))
      marker.on('mouseover', customTip);
      marker.on('click', customPop)
     }
    }
   },

   moveToMarker(point) {
    if (point.selected === true || point.length === 1) {
     this.map.flyTo([point.geo.latitude, point.geo.latitude], 8, {
      animate: true,
      duration: 1
     })
    }
   },

  },
  mounted() {
   this.createMapInstance()
  },
  created() {
   this.fixBug()
  },
 };
</script>

<style scoped>

 .rel {
  position: relative;
 }

 .l-map {
  height: 100vh;
  width: 100%;
 }
</style>
