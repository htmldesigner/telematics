<template>
 <div class="rel">
  <div ref="mapContainer" id="mapContainer" class="l-map"></div>
 </div>
</template>

<script>

 import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
 import * as ELG from "esri-leaflet-geocoder";
 import * as LCG from "leaflet-control-geocoder";

 export default {
  name: "llmap",
  components: {},
  data() {
   return {
    defaultZoom: 8,
    defaultCenter: [51.7971, 55.1137],
    OSMUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    // singleLine: [
    //  [
    //   [51.49282033577651, -0.11432647705078126],
    //   [51.48010001366223, -0.10265350341796876],
    //   [51.48084836613703, -0.08222579956054689],
    //   [51.49591970845512, -0.08239746093750001]
    //  ],
    //  [
    //   [51.47614423230301, -0.08909225463867188],
    //   [51.47571655971428, -0.05973815917968751],
    //   [51.4829864484029, -0.03398895263671876],
    //   [51.49025517833079, -0.008239746093750002],
    //   [51.477641054786694, 0.008583068847656252],
    //   [51.487796767005534, 0.021800994873046875]
    //  ]
    // ],

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
    getTracks: 'getTracks'
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
   ...mapActions(['updateSelectedObjectsPositionByImei', 'loadTracksFor']),
// Global map instance
   createMapInstance() {
    const map = L.map(this.$refs.mapContainer,).setView(this.defaultCenter, this.defaultZoom)
    const mapLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
     maxZoom: 18,
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    setTimeout(() => {
     map.invalidateSize()
    }, 200)

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
    <span style="font-size: 10px">${newValue[i].geo.fix_date}</span>
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
    object.forEach((el) => {
     this.mapInstance.flyTo([el.geo.latitude, el.geo.longitude], 7, {animate: true})
     this.loadTracks(el.imei)
    })
   },

   async loadTracks(id) {
    let params = {
     ids: id,
     dateFrom: new Date(new Date().getTime() - 3600 * 3 * 1000 - 3600 * 24 * 170 * 1000).toLocaleString(),
     dateTo: new Date(new Date().getTime() - 3600 * 24 * 170 * 1000).toLocaleString(),
     speedLimit: '0,11,20'
    }
    await this.loadTracksFor(params)
    this.addPolyline()
   },

   addPolyline() {
    let item = []
    this.getTracks.playback.forEach(el => {
     item.push([el[0], el[1]])
    })
    console.log(item)
    let singleLineStyle = {
     stroke: true,
     color: "#0040ff",
     weight: 2,
     opacity: 1
    };

    let polyline = L.polyline(item, singleLineStyle)
    polyline.addTo(this.mapInstance)
    return polyline

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
     }, 1000 * 2);
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
