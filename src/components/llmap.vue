<template>
 <div class="rel">
  <a href="#" @click.prevent="mapReset" id="refreshButton"><i class="fa fa-eraser"></i></a>
  <div ref="mapContainer" id="mapContainer" class="l-map"></div>
 </div>
</template>

<script>

 import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
 import * as ELG from "esri-leaflet-geocoder";
 import moment from 'moment'
 import Draw from 'leaflet-draw'
 import Zoomslider from 'leaflet.zoomslider'
 import {eventBus} from '../eventBus'
 import mapInstance from "../store/modules/mapInstance";

 export default {
  name: "llmap",
  components: {},
  data() {
   return {
    defaultZoom: 10,
    defaultCenter: [51.7971, 55.1137],
    OSMUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    arrowicon: L.icon({
     iconUrl: '/img/navigator64.png',
     iconSize: [32, 32],
     iconAnchor: [16, 16]
    }),

    directionicon: L.icon({
     iconUrl: '/img/directionicon.png',
     iconSize: [10, 16],
     iconAnchor: [5, 8]
    }),

    markers: [],
    watchingObjects: [],
    interval: null,

    drawControl: null,
    zoomZoomslider: null
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    currentComponent: 'getCurrentComponent',
    objects: 'getObjects',
    selectedObjects: 'getSelectedObjects',
    getMonitor: 'getMonitorObjects',
    selectedGeozone: 'selectedGeozone',
    modifyGeozone: 'getModifiableGeozone',
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
   },
   selectedGeozone: {
    handler(zone) {
     this.geozonesDraw(zone)
    }
   },
   modifyGeozone: {
    handler(zone) {
     this.drawModifyGeozone(zone)
    }
   }
  },
  methods: {
   ...mapMutations('mapModule', ['SET_MAP_INSTANCE']),
   ...mapMutations('playbackModule', ['SET_PLAYBACK_INSTANCE']),
   ...mapActions(['updateSelectedObjectsPositionByImei', 'saveGeozones']),


// Global map instance
   createMapInstance() {
    const map = L.map(
     this.$refs.mapContainer, {zoomControl: false}).setView(
     this.defaultCenter,
     this.defaultZoom
    )
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

    // Поиск
    // var searchControl = new ELG.Geosearch({placeholder: "Поиск"}).addTo(map);
    // var results = L.layerGroup().addTo(map);
    // searchControl.on('results', function (data) {
    //  results.clearLayers();
    //  for (var i = data.results.length - 1; i >= 0; i--) {
    //   results.addLayer(L.marker(data.results[i].latlng));
    //   console.log(data)
    //  }
    // });

    this.myRenderer = L.canvas({padding: 0.5});

    L.control.layers({
     'OSM': osm,
     'custom': custom,
     "google": google1.addTo(map),
     "google2": google2,
    }, {}, {position: 'topleft', collapsed: true}).addTo(map)

    // L.control.zoom({
    //  position: 'topleft'
    // }).addTo(map);

    L.control.scale().addTo(map);

    map.on('zoomend', function () {
     eventBus.$emit('mapzoomend', this);
    });

    this.geozonesLayer = new L.featureGroup();
    this.geozonesLayer.addTo(map);

    // this.positionTrackLayer = new L.featureGroup();
    // this.positionTrackLayer.addTo(map);

    this.editGeozonesLayer = new L.featureGroup();
    this.editGeozonesLayer.addTo(map);

    this.zoomZoomslider = new L.Control.Zoomslider({position: 'topleft'})

    return map
   },

   mapReset() {
    this.geozonesLayer.clearLayers();
    for (let i in this.markers) {
     this.mapInstance.removeLayer(this.markers[i])
    }
    this.$store.dispatch('loadObjects')
    this.$store.dispatch('loadGeozones')
    eventBus.$emit('map-Clear', 'mapClear');
    this.mapInstance.setView(this.defaultCenter, this.defaultZoom);
   },

   createPlaybackInstance() {
    this.map = this.mapInstance;
    var self = this;
    // Playback options
    let playbackOptions = {
     // layer and marker options
     tracksLayer: false,
     orientIcons: true,
     layer: {
      pointToLayer: function (featureData, latlng) {
       let result = {};
       if (featureData && featureData.properties && featureData.properties.path_options) {
        result = featureData.properties.path_options;
       }
       if (!result.radius) {
        result.radius = 5;
       }
       result.weight = 1;
       return new L.CircleMarker(latlng, result);
      }
     },
     marker: function () {
      return {
       icon: L.icon({
        iconUrl: '/img/navigator48.png',
        iconSize: [32, 32], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0], // the same for the shadow
        popupAnchor: [10, 10] // point from which the popup should open relative to the iconAnchor
       }),
       zIndexOffset: 10100
      }
     },
     moveCallback(e) {
      self.map.panTo([e.latlng.lat, e.latlng.lng]);
     },

    };

    return new L.Playback(this.map, [], null, playbackOptions);
   },


   renderMap() {
    this.SET_MAP_INSTANCE(this.createMapInstance())
    this.SET_PLAYBACK_INSTANCE(this.createPlaybackInstance())
   },


   drawInit() {
    let self = this;
    // Initialise the FeatureGroup to store editable layers
    this.editableLayers = new L.FeatureGroup();
    this.mapInstance.addLayer(this.editableLayers);

    let drawPluginOptions = {
     position: 'topleft',
     draw: {
      polygon: {
       allowIntersection: false, // Restricts shapes to simple polygons
       drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
       },
       shapeOptions: {
        color: '#97009c'
       }
      },
      // disable toolbar item by setting it to false
      polyline: false,
      circle: false, // Turns off this drawing tool
      circlemarker: false,
      rectangle: false,
      marker: true,
     },
     edit: {
      featureGroup: this.editableLayers //REQUIRED!!
     }
    };

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    let drawControl = new L.Control.Draw(drawPluginOptions)

    this.drawControl = new L.Control.Draw(drawPluginOptions)

    this.mapInstance.on('draw:created', function (e) {
     let type = e.layerType,
      layer = e.layer;

     let feature = layer.feature = layer.feature || {}; // Initialize feature
     feature.type = feature.type || "Feature"; // Initialize feature.type

     let props = feature.properties = feature.properties || {}; // Initialize feature.properties
     props.title = props.title = props.title || "Пустое название";

     self.editableLayers.addLayer(layer);

     let template = `
     <form id="popup-form">
        <label for="input-name">Наименование :</label>
        <input id="input-name" class="popup-input" type="text" />
        <input id="input-color" class="popup-input" type="color" />
        <button id="button-submit" type="button">Сохранить</button>
     </form>
     `;

     function layerClickHandler(e) {

      var marker = e.target,
       properties = e.target.feature.properties;

      if (marker.hasOwnProperty('_popup')) {
       marker.unbindPopup();
      }

      marker.bindPopup(template);
      marker.openPopup();

      let inputName = L.DomUtil.get('input-name');
      let inputColor = L.DomUtil.get('input-color');

      inputName.value = properties.title;
      inputColor.value = properties.color;

      L.DomEvent.addListener(inputName, 'change', function (e) {
       properties.title = e.target.value;
      });

      L.DomEvent.addListener(inputColor, 'change', function (e) {
       properties.color = e.target.value;
      });

      var buttonSubmit = L.DomUtil.get('button-submit');
      L.DomEvent.addListener(buttonSubmit, 'click', function (e) {
       marker.closePopup();
      });

     }


     layer.on('click', layerClickHandler);
     // layer.on("click", function (e) {
     //  let props = e.sourceTarget.feature.properties; // Initialize feature.properties
     //  let title = prompt("Укажите название объекта", props.title);
     //  if (title != null) {
     //   props.title = title;
     //  } else {
     //   props.title = "";
     //  }
     // });
    });


   },

   drawShow() {
    this.mapInstance.addControl(this.drawControl)
   },
   drawHide() {
    this.mapInstance.removeControl(this.drawControl)
    this.editableLayers.clearLayers()
   },
   drawGetGeozones() {
    return this.editableLayers.getLayers()
   },

   drawModifyGeozone(geozone) {
    let self = this;

    this.editGeozonesLayer.clearLayers();

    this.mapInstance.removeControl(this.drawControl)

    let geom = JSON.parse('{"type": "Feature", "geometry": ' + geozone.geom + ', "properties": {"color":"red"}}');
    L.geoJSON(geom, {
     style: function (feature) {
      return {color: geozone.color};
     },
     onEachFeature: function (feature, layer) {
      self.editGeozonesLayer.addLayer(layer);
     }
    });

    this.map.fitBounds(this.editGeozonesLayer.getBounds()) // полет к выделенному

    let drawPluginOptions = {
     position: 'topleft',
     draw: false,
     edit: {
      featureGroup: this.editGeozonesLayer,
      remove: true,
      edit: true
     }
    };

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    this.drawControl = new L.Control.Draw(drawPluginOptions);

    this.mapInstance.addControl(this.drawControl)
    this.mapInstance.on('draw:edited', function (e) {
     var layers = e.layers;
     layers.eachLayer(function (layer) {
      console.log(layer)
     });
    });

   },


   saveList(layers, idGroup) {
    let layersData = [];
    for (let layer of layers) {
     let geom = layer.toGeoJSON();
     layersData.push({
      name: geom.properties.title,
      color: geom.properties.color,
      geometry: JSON.stringify(geom.geometry)
     });
    }
    this.saveGeozones({id: idGroup, layersData})
   },


   geozonesDraw(geozonesList) {
    // Show all geozones in list
    this.geozonesClear();
    for (let i in geozonesList) {
     let geozone = geozonesList[i];

     let geom = JSON.parse('{"type": "Feature", "geometry": ' + geozone.geom + ', "properties": {"id": 1, "name": "one", "color":"red"}}');
     let geolayer = L.geoJSON(geom, {
      style: function (feature) {
       return {color: geozone.color};
      },
     }).bindPopup(geozone.name).addTo(this.geozonesLayer);
    }
    if (geozonesList.length > 0) {
     this.mapInstance.flyToBounds(this.geozonesLayer.getBounds())
    }
   },

   geozonesClear() {
    this.geozonesLayer.clearLayers();
   },

   zoomSliderShow() {
    this.mapInstance.addControl(this.zoomZoomslider)
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
        <p class="p-0 m-0" style="font-size: 12px; font-weight: bold">IMEI</p>
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
  async mounted() {
   await this.renderMap()
   await this.drawInit()
  }
 }
</script>

<style scoped>


 .rel {
  position: relative;
  height: 100%;
 }

 .l-map {
  height: 100%;
  width: 100%;
 }
</style>
