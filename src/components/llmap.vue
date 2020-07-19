<template>
 <div class="rel">
  <div ref="mapContainer" id="mapContainer" class="l-map"></div>
 </div>
</template>

<script>

 import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
 import * as ELG from "esri-leaflet-geocoder";
import moment from 'moment'
 export default {
  name: "llmap",
  components: {},
  data() {
   return {
    defaultZoom: 8,
    defaultCenter: [51.7971, 55.1137],
    OSMUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    arrowicon: L.icon({
     iconUrl: '/img/navigator64.png',
     iconSize: [32, 32],
     iconAnchor: [16, 16]
    }),

    markers: [],
    watchingObjects: [],
    interval: null,
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    objects: 'getObjects',
    selectedObjects: 'getSelectedObjects',
    getMonitor: 'getMonitorObjects',
   }),
  },
  watch: {
   objects: {
    handler(newValue) {
     this.addMarker(newValue)
    },
    deep: true,
   },
   getMonitor: {
    handler(object) {
     this.monitorObjects(object)
     this.moveTo(object)
    }
   }
  },
  methods: {
   ...mapMutations('mapModule', ['SET_MAP_INSTANCE']),
   ...mapActions(['updateSelectedObjectsPositionByImei']),

// Global map instance
   createMapInstance() {
    const map = L.map(this.$refs.mapContainer,).setView(this.defaultCenter, this.defaultZoom)
    const mapLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
     maxZoom: 18,
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    let osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: ''});

    let google1 = L.tileLayer('//{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
     maxZoom: 20,
     subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    let google2 = L.tileLayer('//www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
     attribution: 'google'
    });

    let custom = L.tileLayer('/img?x={x}&y={y}&z={z}', {minZoom: 7, maxZoom: 16, attribution: 'ccs', tms: false});

    var searchControl = new ELG.Geosearch({placeholder: "Поиск"}).addTo(map);

    var results = L.layerGroup().addTo(map);
    searchControl.on('results', function (data) {
     results.clearLayers();
     for (var i = data.results.length - 1; i >= 0; i--) {
      results.addLayer(L.marker(data.results[i].latlng));
      console.log(data)
     }
    });

    L.control.layers({
     'OSM': osm,
     'custom': custom,
     "google": google1.addTo(map),
     "google2": google2,
    }).addTo(map)

    return map
   },

   renderMap() {
    this.SET_MAP_INSTANCE(this.createMapInstance())
   },

// Add\Remove marker on the map
   async addMarker(newValue) {
    for (let i in this.markers) {
     this.mapInstance.removeLayer(this.markers[i])
    }
    this.markers = []
    for (let i in newValue) {
     if (newValue[i].selected) {
      const marker = L.marker(new L.LatLng(newValue[i].geo.latitude, newValue[i].geo.longitude),
       {
        rotationAngle: newValue[i].geo.course,
        icon: this.arrowicon
       })
      this.markers.push(marker)

      // Need optimization
      let geocodeService = ELG.geocodeService()
      geocodeService.reverse().latlng([newValue[i].geo.latitude, newValue[i].geo.longitude]).run(function (error, result) {
       if (error) {
        return;
       }
       return newValue[i].address = result.address.Match_addr
      })

      function customTip() {
       this.unbindTooltip();
       if (!this.isPopupOpen()) {
        this.bindTooltip(`
        <div class="custom-tooltips d-flex flex-column p-2" style="width: 320px">

<div class="header-tooltips d-flex justify-content-between align-content-start">

  <div class="custom-tooltips-name">
    <h5>${newValue[i].name}</h5>
  </div>

  <div class="custom-tooltips-time">
    <span style="font-size: 10px">${moment(newValue[i].geo.fix_date).format('MM-DD-YYYY hh:mm')}</span>
 </div>

</div>
<hr class="p-0 m-0">
  <div class="content-container">

      <div class="custom-tooltips-address mb-1 mt-1">
         <span style="font-size: 12px">${newValue[i].address}</span>
         </div>
      </div>
<hr class="p-0 m-0">
  <div class="unit-content-container d-flex flex-row justify-content-between mt-2">
        <div class="text-center">
        <p class="p-0 m-0" style="font-size: 12px; font-weight: bold">Скорость</p>
        <span>${newValue[i].geo.speed} км/ч</span>
        </div>
        <div class="text-center">
        <p class="p-0 m-0" style="font-size: 12px; font-weight: bold">Imei</p>
        <span>${newValue[i].imei}</span>
        </div>
        <div class="text-center">
        <p class="p-0 m-0" style="font-size: 12px; font-weight: bold">Координаты</p>
        <span>${newValue[i].geo.latitude}<br>${newValue[i].geo.longitude}</span>
        </div>
  </div>



</div>
        `,
         {interactive: true}).openTooltip();
       }
      }

      function customPop() {
       this.unbindTooltip();
      }

      this.mapInstance.addLayer(marker.bindPopup('доп функции', {className: "custom-popup"}))
      marker.on('mouseover', customTip);
      marker.on('click', customPop)
     }
    }
   },

   async moveTo(object) {
    console.log(object)
    object.forEach((el) => {
     this.mapInstance.flyTo([el.geo.latitude, el.geo.longitude], 7, {animate: true})
    })
   },

   monitorObjects(object) {
    clearInterval(this.interval)
    if (object.length !== 0) {
     this.interval = setInterval(() => {
      for (let i in object) {
       if (object[i].monitor && object[i].selected) {
        this.updateSelectedObjectsPositionByImei(object[i].imei)
       }
      }
     }, 1000 * 5);
    } else {
     clearInterval(this.interval)
    }
   },

  },
  mounted() {
   this.renderMap()
  }
 }
</script>

<style scoped>



 .rel {
  position: relative;
 }

 .l-map {
  height: calc(100vh - 56px);
  width: 100%;
 }
</style>
