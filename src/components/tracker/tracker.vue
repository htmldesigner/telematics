<template>
 <div class="tracker-container mt-3 px-2">

  <div class="row">
   <div class="col">
    <div class="objectSelector d-flex align-items-center">
     <label for="objectSelector1">Объект:</label>
     <select v-model="selectedObjectId" class="form-control form-control-custom" id="objectSelector1">
      <option v-for="object of objectsArr" v-bind:value="object.id" :key="object.id">
       {{ object.name }}
      </option>
     </select>
    </div>
   </div>
  </div>
  <div class="row">
   <div class="col">

    <span class="title-custom">Загрузить трек за периуд:</span>

    <div class="form-group row">
     <label for="example-datetime-local-input1" class="col-2 col-form-label">От:</label>
     <div class="col-10">
      <input class="form-control form-control-custom" type="datetime-local" v-model="datefrom"
             id="example-datetime-local-input1">
     </div>
    </div>

    <div class="form-group row">
     <label for="example-datetime-local-input2" class="col-2 col-form-label">До:</label>
     <div class="col-10">
      <input class="form-control form-control-custom" type="datetime-local" v-model="dateto"
             id="example-datetime-local-input2">
     </div>
    </div>

    <button type="button" :disabled="loading" class="btn-custom float-right mt-2" @click="loadTracks">
     <span v-if="loading">Загрузка...</span>
     <span v-else>Загрузить треки</span>
    </button>

   </div>
  </div>

  <div class="routes mt-5">
   <div class="row">
    <div class="col p-0 m-0">
     <div class="player">
      <Player ref="player"/>
     </div>
    </div>
   </div>
  </div>

 </div>
</template>

<script>
 import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
 import moment from 'moment'
 import Player from "../Player";
 import 'leaflet-polylinedecorator'
 import {eventBus} from "../../eventBus";

 export default {
  name: "tracker",
  components: {
   Player,
  },
  data() {
   return {
    icon: {
     stop: '/img/stops.svg',
     stop_off: '/img/stops-off.svg',
     speed: '/img/speedings.svg',
     speed_off: '/img/speedings-off.svg',
     parking: '/img/parkings.svg',
     parking_off: '/img/parkings-off.svg',
     filling: '/img/fillings.svg',
     filling_off: '/img/fillings-off.svg',
     playButton: '/img/play.svg',
     pauseButton: '/img/pause.svg',
     remove: '/img/remove.svg'
    },

    loading: null,
    selectedObjectId: "",

    trackLayer: new L.featureGroup(),
    pointLayer: new L.featureGroup(),
    stopMarkerGroup: new L.featureGroup(),
    geo: null,

    directionicon: L.icon({
     iconUrl: require('@/assets/directionicon.png'),
     iconSize: [8, 14],
     iconAnchor: [4, 7]
    }),

    parkingred: L.icon({
     iconUrl: require('@/assets/parking_red.svg'),
     iconSize: [32, 32],
     iconAnchor: [16, 32]
    }),

    parkingblue: L.icon({
     iconUrl: require('@/assets/parking_blue.svg'),
     iconSize: [32, 32],
     iconAnchor: [16, 32]
    }),
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    objects: 'getObjects',
    timeIntervalStartDate: 'getTimeIntervalStart',
    timeIntervalEndDate: 'getTimeIntervalEnd',
    getSpeedLimits: 'getSpeedLimits',
    getStopMinDuration: 'getStopMinDuration',
    getOverSpeedMinDuration: 'getOverSpeedMinDuration',
   }),

   objectsArr() {
    this.refreshObjectsInput()
    return this.objects
   },

   datefrom: {
    set(val) {
     this.SETTIMEINTERVALSTART(val);
    },
    get() {
     return this.timeIntervalStartDate
    }
   },
   dateto: {
    set(val) {
     this.SETTIMEINTERVALEND(val);
    },
    get() {
     return this.timeIntervalEndDate
    }
   },
  },
  methods: {
   ...mapMutations(['SETTIMEINTERVALSTART', 'SETTIMEINTERVALEND']),

   async loadTracks() {
    this.loading = true

    const id = this.selectedObjectId;

    let currentDevice = Object.assign({}, ...this.$store.state.monitoring.objects.filter(device => device.id === id).map(el => {
     return {name: el.name, sensors: el.sensors}
    }))

    let query = [
     {
      type: "track",
      objectId: id,
      dateFrom: this.datefrom,
      dateTo: this.dateto,
     },
     {
      type: "stop",
      objectId: id,
      dateFrom: this.datefrom,
      dateTo: this.dateto,
      stopMinDuration: this.getStopMinDuration,
     }]

    let tracksDate = await this.$store.dispatch('loadTracks', query)
    this.parseServiceResult(tracksDate.data.data, currentDevice)
    this.loading = false
   },

   parseServiceResult(data, currentDevice) {

    console.time('print-track-on-map-time')

    let self = this

    for (const serviceResult of data) {
     switch (serviceResult.queryType) {
      case 'track':
       track(serviceResult, this.getSpeedLimits, currentDevice)
       break;
      case 'stop':
       stop(serviceResult, this.getStopMinDuration, currentDevice)
     }
    }

// TRACK
    function track(serviceResult, speedLimits, currentDevice) {

     if (serviceResult.queryType === "track") {

      let getSpeedIndex = (speed, speedLimits) => {
       let speedIndex
       speedLimits.forEach((el, index) => {
        if (speed >= el.speed) {
         speedIndex = index
        }
       })
       return speedIndex
      }

      let speedIndex = 0
      let first = true
      let speedGroup = []
      let startTime = 0
      let startSpeed = 0
      let totalGeoZones = []
      let previousGeoZones = []
      let distanceSum = 0
      let maxSpeed = 0
      let speedList = []

      self.geo = {
       "type": "FeatureCollection",
       "features": speedList
      }

      if (serviceResult.data.length) {
       serviceResult.data.forEach((element) => {

        let [lt, ln, speed, fix_date, course, distance, geoZones_id] = element

        if (maxSpeed < speed) {
         maxSpeed = speed;
        }

        speedGroup.push([ln, lt])
        distanceSum += distance;
        if (first) {
         first = false;
         speedIndex = getSpeedIndex(speed, speedLimits)
         startTime = fix_date;
         startSpeed = speed;
         distanceSum = 0;
        } else {
         if (getSpeedIndex(speed, speedLimits) === speedIndex) {
          speedIndex = getSpeedIndex(speed, speedLimits)
         } else {
          let diff = moment(fix_date).diff(moment(startTime));
          let avgSpeed = Math.round((distanceSum / 1000) / (diff / 1000 / 60 / 60));

          speedList.push(
           {
            "type": "Feature",
            "properties": {
             "currentDevice": currentDevice,
             "speedIndex": speedIndex,
             "startTime": startTime,
             "endTime": fix_date,
             "startSpeed": startSpeed,
             "endSpeed": speed,
             "distance": distanceSum,
             "maxSpeed": maxSpeed,
             "avgSpeed": avgSpeed,
            },
            "geometry": {
             "type": "LineString",
             "coordinates": speedGroup
            }
           }
          )
          distanceSum = 0;
          speedGroup = [];
          speedGroup.push([ln, lt])
          startTime = fix_date;
          startSpeed = speed;
          speedIndex = getSpeedIndex(speed, speedLimits)
         }
        }
       });
      } else {
       self.$store.dispatch('setError', 'Нет данных по треку')
      }


      let toolitps = (properties) => {

       let tpl = `
  <div class="tooltips_content">
    <div class="tooltips_header">
      <div class="name">${properties.currentDevice.name}</div>
    </div>

   <div class="time_control">
    <div class="start_time"><span>Начало</span> ${moment(properties.startTime).format('MM-DD-YYYY hh:mm')}</div>
    <div class="end_time"><span>Конец</span> ${moment(properties.endTime).format('MM-DD-YYYY hh:mm')}</div>
   </div>

   <div class="speed_control">
    <div class="start_speed"><span>Начальная скорость ${properties.startSpeed}</span> км/ч</div>
    <div class="end_speed"><span>Конечная скорость ${properties.endSpeed}</span> км/ч</div>
   </div>

  </div>
        `;
       return tpl;
      };

      function onEachFeature(feature, layer) {
       if (feature.properties) {
        layer.bindTooltip(toolitps(feature.properties), {className: "tooltips", sticky: true, permanent: false});
       }
      }

      let getColor = (speedIndex, speedColor) => {
       return speedColor[parseInt(speedIndex)].color
      }

      function style(feature) {
       return {
        weight: 4,
        opacity: 1,
        color: getColor(feature.properties.speedIndex, speedLimits),
       };
      }


      self.trackLayer.addTo(self.mapInstance).getBounds()

      let goeData = L.geoJSON(self.geo, {style: style, onEachFeature: onEachFeature})
      self.trackLayer.addLayer(goeData)
      // self.mapInstance.flyToBounds(self.trackLayer.getBounds(), {maxZoom: 10})
      
      self.makePointsLayer()
      console.log(serviceResult.data.length)
     }
    }

    console.timeEnd('print-track-on-map-time')

//STOP
    function stop(serviceResult, stopMinDuration, currentDevice) {

     if (serviceResult.queryType === "stop") {

      if (serviceResult.data.length) {

       self.stopMarkerGroup.addTo(self.mapInstance)

       serviceResult.data.forEach(element => {

        let duration = moment.utc(element.duration * 1000).format('HH:mm:ss')

        if (element.duration > stopMinDuration) {

         let ico = element.duration > 300 ? self.parkingred : self.parkingblue

         let icon = L.divIcon({
          className: "map-label",
          html: '<img src="' + ico.options.iconUrl + '" /><div class="map-label-content">' + duration + '</div>',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
         });

         let marker = L.marker([element.latitude, element.longitude], {
          icon: icon
         })
         marker.bindTooltip(`${duration}`, {sticky: true, permanent: false, direction: 'right'})

         self.stopMarkerGroup.addLayer(marker)

        }
       })
      } else {
       self.$store.dispatch('setError', 'Нет данных по стоянкам')
      }

     }
    }

   },


   makePointsLayer(zoom) {
    console.log(zoom)
    this.pointLayer.clearLayers()

    let pointsCollection = []



    var lines = geo.features.filter(function(feature) { return feature.geometry.type === "LineString" })
     .map(function(feature) {
      var coordinates = feature.geometry.coordinates;
      coordinates.forEach(function(coordinate) { coordinate.reverse(); })
      return L.polyline(coordinates);
     })





    this.geo.features.filter((feature) => {
     return feature.geometry.type === "LineString"
    })
     .forEach((feature) => {
      pointsCollection.push(
       {
        "type": "MultiPoint",
        "coordinates":
        feature.geometry.coordinates
       }
      )
     })

    let filterPointsCollection = pointsCollection.filter((el, index) => {
      if (zoom > 8 && zoom <= 10){
       return index % 12 === 0
      }
     if (zoom > 10 && zoom <= 12){
      return index % 6 === 0
     }
     if (zoom > 12){
      return index
     }
     }
    )

    let geoPoints = {
     "type": "FeatureCollection",
     "features": filterPointsCollection
    }

    console.log(Object.values(geoPoints))

    this.pointLayer.addTo(this.mapInstance)

    var geoJsonPointOptions = {
     radius: 5,
     fillColor: "#001aff",
     weight: 0,
     opacity: 1,
     fillOpacity: 0.8
    };

    let goePoint = L.geoJSON(geoPoints, {
     pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geoJsonPointOptions);
     }
    })

    this.pointLayer.addLayer(goePoint)
    pointsCollection = []
   },


   refreshObjectsInput() {
    if (Object.keys(this.objects).length > 0) {
     let key = Object.keys(this.objects)[0];
     this.selectedObjectId = this.objects[key].id;
    }
   }

  },
  mounted() {
   eventBus.$on('mapZoomEnd', (zoom) => {
    this.makePointsLayer(zoom)
   });

   eventBus.$on('map-Clear', () => {
    this.trackLayer.clearLayers()
    this.pointLayer.clearLayers()
    this.stopMarkerGroup.clearLayers()
   });

  }
 }
</script>

<style scoped>
 .objectSelector label {
  margin: 0 20px 0 0;
  padding: 0;
 }

 .tracker-result {
  border-bottom: 1px solid #c2c2c2;
  margin-bottom: 10px;

 }

 .routes-target {
  background-color: #f5f5f5;
  padding: 10px;
  margin: 0 0 1px 0;
 }

 .routes-target p {
  padding: 0;
  margin: 0;
  font-size: 14px;
 }

</style>