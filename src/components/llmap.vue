<template>
 <div class="rel">
  <a href="#" @click.prevent="mapReset" class="refreshButton">
   <img src="@/assets/erase.svg" alt="">
  </a>
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

    markerGroup: new L.featureGroup(),

    arrowicon: L.icon({
     iconUrl: require('@/assets/navigator64.png'),
     iconSize: [30, 30],
     iconAnchor: [16, 16]
    }),

    markers: [],
    interval: null,

    drawControl: null,
    zoomZoomslider: null
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    objects: 'getObjects',
    selectedObjects: 'getSelectedObjects',
    selectedGeozone: 'selectedGeozone',
    modifyGeozone: 'getModifiableGeozone',
    getMapZoom: 'getMapZoom',
    getMapCenter: 'getMapCenter',
   }),

   zoom: {
    set(val) {
     this.SETMAPZOOM(val);
    },
    get() {
     return this.getMapZoom || this.defaultZoom;
    }
   },

   center: {
    set(val) {
     this.SETMAPCENTER(val);
    },
    get() {
     return this.getMapCenter !== null ? this.getMapCenter : this.defaultCenter;
    }
   },

  },
  watch: {
   objects: {
    handler(newValue) {
     this.addMarker(newValue)
    },
    deep: true,
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
   ...mapMutations(['SETMAPZOOM', 'SETMAPCENTER']),

   ...mapActions(['updateSelectedObjectsPositionByImei', 'saveGeozones']),

// Global map instance
   createMapInstance() {
    let self = this
    const map = L.map(
     this.$refs.mapContainer, {zoomControl: false, preferCanvas: true}).setView(
     this.center,
     this.zoom
    )

    let osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom: 18,
     minZoom: 4,
     attribution: ''
    });
    let google1 = L.tileLayer('//{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
     maxZoom: 20, minZoom: 4,
     subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    let google2 = L.tileLayer('//www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
     attribution: 'google',
     maxZoom: 20, minZoom: 4,
    });

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

    L.control.layers({
     'OSM': osm.addTo(map),
     "google": google1,
     "google2": google2,
    }, {}, {position: 'topleft', collapsed: true}).addTo(map)

    L.control.zoom({
     position: 'topleft'
    }).addTo(map);

    L.control.scale().addTo(map);

    map.on('zoomend', function () {
     eventBus.$emit('mapZoomEnd', map.getZoom());
    });

    map.on('moveend', function () {
     self.center = map.getCenter()
     self.zoom = map.getZoom()
    });

    this.markerGroup.addTo(map)

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
    this.markerGroup.clearLayers()
    this.$store.dispatch('loadObjects')
    this.$store.dispatch('loadGeozones')
    eventBus.$emit('map-Clear', 'mapClear');
    this.mapInstance.setView(this.defaultCenter, this.defaultZoom);
   },

   createPlaybackInstance() {
    this.map = this.mapInstance;
    let self = this;
    // Playback options
    let playbackOptions = {
     tracksLayer: false,
     orientIcons: true,
     marker: function () {
      return {
       icon: L.icon({
        iconUrl: require('@/assets/navigator64.png'),
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
     }).bindPopup(`${geozone.name} <br><hr> <span>Ограничение скорости </span> ${geozone.speedlimit} км/ч`).addTo(this.geozonesLayer);
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

    this.markerGroup.clearLayers()

    for (let i in newValue) {
     if (newValue[i].selected && newValue[i].geo) {
      let marker = L.marker([newValue[i].geo.latitude, newValue[i].geo.longitude], {
       icon: this.arrowicon,
       rotationAngle: newValue[i].geo.course,
      })

      // Need optimization
      let geocodeService = ELG.geocodeService()
      geocodeService.reverse().latlng([newValue[i].geo.latitude, newValue[i].geo.longitude])
       .run(function (error, result) {
        if (error) {
         return;
        }
        return newValue[i].address = result.address.Match_addr
       })

      let toolitps = () => {
       let tpl = `

  <div class="tooltips_content">
    <div class="tooltips_header">
      <div class="name">${newValue[i].name}</div>
      <div class="last_contact">${moment(newValue[i].geo.fix_date).format('MM-DD-YYYY hh:mm')}</div>
    </div>

     <div class="address"><hr> ${newValue[i].address}<hr></div>

     <div class="tooltips_footer">
       <div class="speed"><span>Последняя скорость</span>${newValue[i].geo.speed} км/ч</div>
       <div class="coords"><span>Координаты</span>${newValue[i].geo.latitude}<br>${newValue[i].geo.longitude}</div>
     </div>
  </div>
        `;


       return tpl;
      };
      marker.bindTooltip(toolitps, {className: "tooltips"})
      this.markerGroup.addLayer(marker)
     }
    }
   },
  },

  async mounted() {
   await this.renderMap()
   // await this.drawInit()
   this.zoomSliderShow()
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
