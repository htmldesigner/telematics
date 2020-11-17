<template></template>

<script>
 import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
 import moment from 'moment'
 import 'leaflet-polylinedecorator'
 import {eventBus} from "../eventBus";

 export default {
  name: "Traking",
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

    trackLayer: new L.featureGroup(),
    pointLayer: new L.featureGroup(),
    stopMarkerGroup: new L.featureGroup(),
    directionLayer: new L.featureGroup(),

    goeData: null,
    geo: null,
    pointCollection: null,
    directionCollection: null,

    serviceResultStop: null,
    serviceResultTrack: null,
    currentDevice: null,

    directionicon: L.icon({
     iconUrl: require('@/assets/arrow-mark.svg'),
     iconSize: [10, 10],
     iconAnchor: [6, 7]
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

  props: {
   datefrom: {
    type: String,
    default: null
   },
   dateto: {
    type: String,
    default: null
   },
   selectedObjectId: {
    type: Number,
    default: null
   },
   loadTracks: {
    type: Boolean,
    default: false
   }
  },

  watch: {
   loadTracks(value) {
    if (value) {
     this.loadTrack()
     this.trackLayer.clearLayers()
    }
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
  },

  methods: {
   ...mapMutations(['SETTIMEINTERVALSTART', 'SETTIMEINTERVALEND', 'SETTRACK', 'SETSTOP']),

   async loadTrack() {

    this.SETTRACK(null)
    this.SETSTOP(null)

    await this.trackLayer.clearLayers()
    await this.pointLayer.clearLayers()
    await this.stopMarkerGroup.clearLayers()
    await this.directionLayer.clearLayers()

    this.pointCollection = null
    this.directionCollection = null
    this.geo = null
    this.currentDevice = null

    const id = this.selectedObjectId;

    this.currentDevice = Object.assign({}, ...this.$store.state.monitoring.objects.filter(device => device.id === id).map(el => {
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
     }
    ]

    let tracksDate = await this.$store.dispatch('loadTracks', query)

    this.parseServiceResult(tracksDate.data.data, this.currentDevice)

    this.$emit('loadAfterResult', false)
   },

   parseServiceResult(data, currentDevice) {
    console.time('print-track-on-map-time')

    for (const serviceResult of data) {
     switch (serviceResult.queryType) {
      case 'track':
       this.track(serviceResult, this.getSpeedLimits, currentDevice)
       this.serviceResultTrack = serviceResult
       break;
      case 'stop':
       this.stop(serviceResult, this.getStopMinDuration, currentDevice)
       this.serviceResultStop = serviceResult
     }
    }
    console.timeEnd('print-track-on-map-time')
   },


   track(serviceResult, speedLimits, currentDevice) {
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

     let id = 1

     let speedList = []
     let pointsList = []
     let directionList = []

     this.geo = {
      "type": "FeatureCollection",
      "features": speedList
     }

     this.pointCollection = pointsList
     this.directionCollection = directionList


     if (serviceResult.data.length) {
      serviceResult.data.forEach((element, index, currentArray) => {

       let [lt, ln, speed, fix_date, course, distance, geoZones_id] = element

       if (maxSpeed < speed) {
        maxSpeed = speed;
       }

       speedGroup.push([ln, lt])
       distanceSum += distance
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
           "id": id++,
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

        // let diff = moment(fix_date).diff(moment(startTime));
        // let avgSpeed = Math.round((distanceSum / 1000) / (diff / 1000 / 60 / 60))
        //
        // speedList.push(
        //  {
        //   "type": "Feature",
        //   "properties": {
        //    "currentDevice": currentDevice,
        //    "speedIndex": speedIndex,
        //    "startTime": startTime,
        //    "endTime": fix_date,
        //    "startSpeed": startSpeed,
        //    "endSpeed": speed,
        //    "distance": distanceSum,
        //    "maxSpeed": maxSpeed,
        //    "avgSpeed": avgSpeed,
        //   },
        //   "geometry": {
        //    "type": "LineString",
        //    "coordinates": speedGroup
        //   }
        //  }
        // )
       }

       pointsList.push(
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
         },
         "geometry": {
          "type": "Point",
          "coordinates": [ln, lt]
         }
        }
       )

       //Detected direction
       let [startLat, startLong, endLat, endLong] = [lt, ln, lt, ln]

       if (currentArray[index] && currentArray[index - 1]) {
        [startLat, startLong] = currentArray[index]
         [endLat, endLong] = currentArray[index - 1]
        let direction = this._getBearing(startLat, startLong, endLat, endLong)

        directionList.push(
         {
          "type": "Feature",
          "properties": {
           "currentDevice": currentDevice,
           "direction": direction
          },
          "geometry": {
           "type": "Point",
           "coordinates": [ln, lt]
          }
         }
        )
       }

      });
     } else {
      console.info('Нет данных по треку')
     }

     let toolitps = (properties) => {
      let tpl = `
  <div class="tooltips_content">
    <div class="tooltips_header">
      <div class="name">${properties.currentDevice.name}</div>
    </div>

   <div class="time_control">
    <div class="start_time"><span>Начало</span> ${moment(properties.startTime).format('MM-DD-YYYY HH:mm')}</div>
    <div class="end_time"><span>Конец</span> ${moment(properties.endTime).format('MM-DD-YYYY HH:mm')}</div>
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
       fillOpacity: 0.7,
       color: getColor(feature.properties.speedIndex, speedLimits),
      };
     }

     this.trackLayer.addTo(this.mapInstance)

     if (this.geo.features.length) {

      this.SETTRACK(this.geo)

      this.goeData = L.geoJSON(this.geo, {style: style, onEachFeature: onEachFeature})

      this.trackLayer.addLayer(this.goeData)

      this.mapInstance.flyToBounds(this.trackLayer.getBounds(), {maxZoom: 10, duration: 1})

      speedList = []
      pointsList = []
      directionList = []

     } else {
      this.$store.dispatch('setError', 'Нет данных по треку')
     }
     console.log(serviceResult.data.length)
    }
   },


   stop(serviceResult, stopMinDuration, currentDevice) {
     if (serviceResult.data.length) {
      this.SETSTOP(serviceResult.data)
      this.stopMarkerGroup.addTo(this.mapInstance)
      serviceResult.data.forEach(element => {
       let duration = moment.utc(element.duration * 1000).format('HH:mm:ss')
       if (element.duration > stopMinDuration) {
        let ico = element.duration > 300 ? this.parkingred : this.parkingblue
        let icon = L.divIcon({
         className: "map-label",
         html: '<img src="' + ico.options.iconUrl + '" /><div class="map-label-content">' + duration + '</div>',
         iconSize: [32, 32],
         iconAnchor: [16, 32]
        });
        let marker = L.marker([element.latitude, element.longitude], {
         icon: icon
        })
        // marker.bindTooltip(`${duration}`, {sticky: true, permanent: false, direction: 'right'})
        this.stopMarkerGroup.addLayer(marker)
       }
      })
     } else {
      this.SETSTOP(null)
     }
   },

   makePointsLayer(zoom) {

    if (this.pointCollection) {

     this.pointLayer.addTo(this.mapInstance)

     this.pointLayer.clearLayers()

     let geoJsonPointOptions = {
      radius: 5,
      fillColor: "#001aff",
      weight: 1,
      opacity: 1,
      fillOpacity: 1,
     }

     function highlightFeature(e) {
      let layer = e.target;
      layer.setStyle({
       weight: 2,
       color: '#fff',
       fillColor: "#001aff",
       fillOpacity: 1,
      });

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
       layer.bringToFront();
      }
     }

     function resetHighlight(e) {
      pointData.resetStyle(e.target);
     }

     let toolitps = (properties) => {

      let tpl = `
  <div class="tooltips_content" style="background-color: #42b983">
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
      layer.on({
       mouseover: highlightFeature,
       mouseout: resetHighlight,
      })
     }

     let pointCollection = {
      "type": "FeatureCollection",
      "features": this.pointCollection.filter((point, index) => {
        if (zoom > 8 && zoom <= 10) {
         return index % 50 === 0
        }
        if (zoom > 10 && zoom <= 12) {
         return index % 24 === 0
        }
        if (zoom > 12 && zoom <= 14) {
         return index % 12 === 0
        }
        if (zoom > 14) {
         return index % 6 === 0
        }
       }
      )
     }

     let pointData = L.geoJSON(pointCollection, {
      pointToLayer: function (feature, latlng) {
       return L.circleMarker(latlng, geoJsonPointOptions);
      }, onEachFeature: onEachFeature
     })

     this.pointLayer.addLayer(pointData)
    }

   },

   makeDirectionLayer(zoom) {

    if (this.directionCollection) {
     this.directionLayer.addTo(this.mapInstance)
     this.directionLayer.clearLayers()

     let directionCollection = {
      "type": "FeatureCollection",
      "features": this.directionCollection.filter((point, index) => {
        if (zoom > 9 && zoom <= 11) {
         return index % 37 === 0
        }
        if (zoom > 11 && zoom <= 13) {
         return index % 37 === 0
        }
        if (zoom > 13 && zoom <= 15) {
         return index % 17 === 0
        }
        if (zoom > 15) {
         return index % 4 === 0
        }
       }
      )
     }

     let directionData = L.geoJSON(directionCollection, {
      pointToLayer: (feature, latlng) => {
       return L.marker(latlng, {
        icon: this.directionicon,
        rotationAngle: feature.properties.direction / 2,
       });
      }
     })

     this.directionLayer.addLayer(directionData)
    }

   },

   _getBearing(startLat, startLong, endLat, endLong) {
    startLat = this._radians(startLat);
    startLong = this._radians(startLong);
    endLat = this._radians(endLat);
    endLong = this._radians(endLong);

    let dLong = endLong - startLong;

    let dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
    if (Math.abs(dLong) > Math.PI) {
     if (dLong > 0.0) dLong = -(2.0 * Math.PI - dLong);
     else dLong = 2.0 * Math.PI + dLong;
    }

    return (this._degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
   },

   _radians(n) {
    return n * (Math.PI / 180);
   },

   _degrees(n) {
    return n * (180 / Math.PI);
   },

   getGeoLayer(id) {
    let self = this

    this.goeData?.resetStyle()

    this.goeData?.eachLayer(function (layer) {

     layer.unbindTooltip()

     if (layer.feature.id === id) {
      self.mapInstance.flyToBounds(layer.getBounds(), {maxZoom: 15, duration: 1})

      layer.setStyle({
       weight: 5,
       color: '#ea00f8',
       dashArray: '',
       fillOpacity: 1
      }).bringToFront()

      let toolitps = (properties) => {
       let tpl = `
  <div class="tooltips_content">
    <div class="tooltips_header">
      <div class="name">${properties.currentDevice.name}</div>
    </div>

   <div class="time_control">
    <div class="start_time"><span>Начало</span> ${moment(properties.startTime).format('MM-DD-YYYY HH:mm')}</div>
    <div class="end_time"><span>Конец</span> ${moment(properties.endTime).format('MM-DD-YYYY HH:mm')}</div>
   </div>

   <div class="speed_control">
    <div class="start_speed"><span>Начальная скорость ${properties.startSpeed}</span> км/ч</div>
    <div class="end_speed"><span>Конечная скорость ${properties.endSpeed}</span> км/ч</div>
   </div>

  </div>
        `;
       return tpl;
      };

      layer.bindTooltip(toolitps(layer.feature.properties), {
       className: "tooltips",
       sticky: true,
       permanent: false
      }).openTooltip()

     }

    })
   },

   showStopLayer() {
    if (this.mapInstance.hasLayer(this.stopMarkerGroup)) {
     return
    } else {
     this.stop(this.serviceResultStop, this.getStopMinDuration)
    }
   },
  },


  mounted() {
   eventBus.$on('mapZoomEnd', (zoom) => {
    this.makePointsLayer(zoom)
    this.makeDirectionLayer(zoom)
   });

   eventBus.$on('map-Clear', () => {
    this.trackLayer.clearLayers()
    this.pointLayer.clearLayers()
    this.stopMarkerGroup.clearLayers()
    this.directionLayer.clearLayers()
    this.pointCollection = null
    this.directionCollection = null
    this.$store.dispatch('clearTracksRaport')
   });

   eventBus.$on('speedSelector', (id) => {
    this.getGeoLayer(id)
   })

   eventBus.$on('showStopLayer', (arg) => {
    if (arg === 'stopRaport' && this.serviceResultStop){
      this.showStopLayer()
    }else if (arg === 'overSpeedRaport'){
     this.mapInstance.removeLayer(this.stopMarkerGroup)
    }
   })

  }
 }
</script>

<style scoped>
</style>