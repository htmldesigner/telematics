<template>
 <div class="tracker-container mt-3">
  <div class="container">

   <div class="row mb-3">
    <div class="col">
     <div class="objectSelector d-flex align-items-center">
      <label for="objectSelector1">Объект:</label>
      <select v-model="selectedObjectId" class="form-control" id="objectSelector1">
       <option v-for="object of objectsArr" v-bind:value="object.id">
        {{ object.name }}
       </option>
      </select>
     </div>
    </div>
   </div>

   <div class="row">
    <div class="col">

     <h6 class="mb-3 mt-3 font-weight-bold text-secondary">Загрузить трек за периуд:</h6>

     <div class="form-group row">
      <label for="example-datetime-local-input1" class="col-2 col-form-label">От:</label>
      <div class="col-10">
       <input class="form-control" type="datetime-local" v-model="datefrom" id="example-datetime-local-input1">
      </div>
     </div>

     <div class="form-group row">
      <label for="example-datetime-local-input2" class="col-2 col-form-label">До:</label>
      <div class="col-10">
       <input class="form-control" type="datetime-local" v-model="dateto" id="example-datetime-local-input2">
      </div>
     </div>

     <button type="button" :disabled="loading" class="btn-custom float-right w-50 mt-2" @click="loadTracks">
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
 </div>
</template>

<script>
 import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
 import moment from 'moment'
 import Player from "../Player";
 import api from "@/app/api"

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

    boolOverspeed: true,
    boolStops: true,

    timeIntervalStart: '02.02.2020 18:00',
    timeIntervalEnd: '03.02.2020 18:02',

    data: {},
    layers: {},

    directionicon: L.icon({
     iconUrl: '/img/directionicon.png',
     iconSize: [8, 14],
     iconAnchor: [4, 7]
    }),
    parkingred: L.icon({
     iconUrl: '/img/parking_red.svg',
     iconSize: [32, 32],
     iconAnchor: [16, 32]
    }),
    parkinggreen: L.icon({
     iconUrl: '/img/parking_green.svg',
     iconSize: [32, 32],
     iconAnchor: [16, 32]
    }),
    parkingblue: L.icon({
     iconUrl: '/img/parking_blue.svg',
     iconSize: [32, 32],
     iconAnchor: [16, 32]
    }),
    parkingpink: L.icon({
     iconUrl: '/img/parking_pink.svg',
     iconSize: [32, 32],
     iconAnchor: [16, 32]
    }),

    overspeedIcon:L.icon({
     iconUrl: '/img/overspeed.png',
     iconSize: [20, 20],
     iconAnchor: [10, 10],
    }),
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    objects: 'getObjects',
    timeIntervalStartDate: 'getTimeIntervalStart',
    timeIntervalEndDate: 'getTimeIntervalEnd',

    getSpeedLimitsValue: 'getSpeedLimitsValue',
    speedColor: 'getSpeedLimitsColor',
    getStopminduration: 'getStopminduration',
    getOverSpeedMinduration: 'getOverSpeedMinduration',

   }),

   objectsArr() {
    this.refreshObjectsInput()
    return this.objects
   },

   datefrom: {
    set(val) {
     this.setTimeIntervalStart(val);
    },
    get() {
     return this.timeIntervalStartDate
    }
   },
   dateto: {
    set(val) {
     this.setTimeIntervalEnd(val);
    },
    get() {
     return this.timeIntervalEndDate
    }
   },
  },
  methods: {
   ...mapMutations(['setTimeIntervalStart', 'setTimeIntervalEnd']),


   loadTracks() {

    this.loading = true
    const id = this.selectedObjectId;
    let query = [];
    let startTime = this.timeIntervalStart; // moment(this.timeIntervalStart).format('DD.MM.yyyy, HH:mm');
    let endTime = this.timeIntervalEnd; // moment(this.timeIntervalEnd).format('DD.MM.yyyy, HH:mm');

    query.push(
     {
      type: "track",
      objectId: id,
      dateFrom: startTime,
      dateTo: endTime
     });
    if (this.boolStops)
     query.push(
      {
       type: "stop",
       objectId: id,
       dateFrom: startTime,
       dateTo: endTime,
       stopMinduration: this.getStopminduration,
      });
    if (this.boolOverspeed)
     query.push(
      {
       type: "overspeed2",
       objectId: id,
       dateFrom: startTime,
       dateTo: endTime,
       speedLimits: this.getSpeedLimitsValue[this.getSpeedLimitsValue.length - 1],
       overSpeedMinduration: this.getOverSpeedMinduration,
      });

    this.$store.dispatch('loadTracks',
     {
      query: query,
     }).then(response => {
     this.parseServiceResult(response.data, this.objects[id].name);
     this.loading = false
    }).catch(() => {
     this.loading = false
    })
   },

   parseServiceResult(data, trackname) {
    try {
     //new layer for this query
     Vue.set(this.data, data.queryId, data);
     let queryLayers = [];
     for (const serviceresult of data.data) {
      if (serviceresult.status) {
       switch (serviceresult.queryType) {
        case "track":
         //
         // playback
         try {
          queryLayers.push({
           type: "track",
           data: this.track(serviceresult)
          });
          queryLayers.push({
           type: "playback",
           data: serviceresult
          });
         } catch (ex) {
          console.error(ex);
         }
         // draw lines
         break;
        case "stop":
         //
         // points
         try{
          queryLayers.push({
           type: "stop",
           data: this.stops(serviceresult)
          });
         }catch(ex){
          console.error(ex);
         }
         break;
        case "overspeed":
         //
         // points ?
         // тут надо учесть что это тоже трек и если загружается overspeed - то не нужно грузить и отображать track. но playback остается
         try{
          queryLayers.push({
           type: "overspeed",
           data: this.overspeed(serviceresult)
          });
         }catch(ex){
          console.error(ex);
         }
         break;
        case "overspeed2":
         //
         // points ?
         // тут надо учесть что это тоже трек и если загружается overspeed - то не нужно грузить и отображать track. но playback остается
         try{
          queryLayers.push({
           type: "overspeed2",
           data: this.overspeed2(serviceresult)
          });
         }catch(ex){
          console.error(ex);
         }
         break;
        case "report":
         // треки точки для отчета надо сюда засунуть
         try {
          // console.log("report result--------------")
          // console.log(serviceresult);
          queryLayers.push({
           type: "report",
           reportId: serviceresult.data.reportId,
           report: serviceresult.data.report,
           data: serviceresult.data
          });
         } catch (ex) {
          console.error(ex);
         }
         // start();
         break;
       }
      } else {
       this.$store.dispatch('setError', 'Нет данных')
      }
     }

     if (queryLayers.length > 0) {
      Vue.set(this.layers, data.queryId, {
       layers: queryLayers,
       name: trackname,
       id: data.queryId,
       visible: false,
       minZoom: 14
      });

      this.$refs.player.addTrack({
       layers: queryLayers,
       name: trackname,
       id: data.queryId,
       visible: false
      });
     } else {
      // eventBus.$emit('showmessage', "Отсутствуют данные для загрузки", 'error');
     }
    } catch (ex) {
     console.error(ex);
    }

   },
   track(sResult) {
    //
    let self = this;
    // console.log(sResult);

    let object = this.objects[sResult.objectId];
    let queryLayers = [];

    let trackLayer = new L.featureGroup();
    let speedList = [];

    let length = sResult.data.length;
    //for(let l in object.playback){
    let first = true;
    let lastspeed = 0;
    let speedGroup = [];
    let forindex = 0;
    let starttime = 0;
    let startspeed = 0;
    let totalGeozones = [];
    let previousGeozones = [];
    while (length > forindex) {
     let [lt, ln, speed, fix_date, course, distance, geozones_id] = sResult.data[forindex];

     // Crossed Geozones

     let current = geozones_id.split(',');
     totalGeozones.push(current);

     let zonesEnter = current.filter(x => ! previousGeozones.includes(x));
     let zonesLeave = previousGeozones.filter(x => ! current.includes(x));
     if (zonesEnter.length>0){
      // console.log("Entered to Zone: " + zonesEnter);
     }
     if (zonesLeave.length> 0){
      // console.log("Leave from Zone: " + zonesLeave);
     }

     // Crossed Geozones END

     speedGroup.push([ln, lt])
     if (first) {
      first = false;
      lastspeed = this.getSpeedIndex(speed);
      starttime = fix_date;
      startspeed = speed;
     } else {
      if (this.getSpeedIndex(speed) === lastspeed) {
       lastspeed = this.getSpeedIndex(speed);
      } else {
       speedList.push(
        {
         geom: api.makeGeoJson(speedGroup),
         speedindex: lastspeed,
         starttime: starttime,
         endtime: fix_date,
         index: forindex,
         startspeed: startspeed,
         endspeed: speed
        }
       );
       speedGroup = [];
       speedGroup.push([ln, lt])
       starttime = fix_date;
       startspeed = speed;
       lastspeed = this.getSpeedIndex(speed);
      }

     }

     previousGeozones = current;

     forindex++;
     if (length == forindex) {
      speedList.push(
       {
        geom: api.makeGeoJson(speedGroup),
        speedindex: lastspeed,
        starttime: starttime,
        endtime: fix_date,
        index: forindex,
        startspeed: startspeed,
        endspeed: speed
       }
      ); // догрузить остаток
     }
    }

    for (let track of speedList) {

     let myStyle = {
      "color": this.speedColor[track.speedindex],
      "weight": 5,
      "opacity": 0.65
     };

     //makeText();
     const polyline = L.geoJSON(track.geom, {
      style: myStyle
     }).bindPopup('').on('click', function (e) {

      // eventBus.$emit('speed-selected',track);

      let popup = e.target.getPopup();
      popup.setContent(
       `<div style="width:240px">
    <div class="row">
        <div class="col">` + object.name + `</div>
    </div>
    <hr>
    <div class="row">
        <div class="col">Начало: ` + moment(track.starttime).format('YYYY-MM-DD HH:mm') + `</div>
    </div>
    <div class="row">
        <div class="col">Конец: ` + moment(track.endtime).format('YYYY-MM-DD HH:mm') + `</div>
    </div>
    <div class="row">
        <div class="col">Начальная скорость: ` + track.startspeed + `</div>
    </div>
    <div class="row">
        <div class="col">Конечная скорость: ` + track.endspeed + `</div>
    </div>
</div>
`)});

     trackLayer.addLayer(polyline);
    }
    // цветная линия
    // return trackLayer;

// рисование точек маршрута

    let pointsLayer = new L.featureGroup();
    let pointsLayer2 = new L.featureGroup();
    //speedarray
    // [0,40,60,90]
    let l = 0;
    //for(let l in sResult.data){
    let distance_summ = 0;
    while (length > l) {
     let [lt, ln, speed, fix_date, course, distance, geozones_id, geozones_names] = sResult.data[l];
     distance_summ += distance;
     let dist_now =  Number(distance_summ / 1000).toFixed(2);
     // рисуем каждую 2 точку - а то слишком много точек TODO - надо отдельный массив под это дело с точками.
     L.circleMarker([lt, ln], {
      radius: 5,
      weight: 1,
      fill: true,
      fillColor: "blue",
      fillOpacity: 1
     }).bindTooltip('').on('tooltipopen', function (e) {
      let tooltip = e.target.getTooltip();
      tooltip.setContent(`<div style="width:240px">
    <div class="row">
        <div class="col">` + object.name + `</div>
    </div>
    <hr>
    <div class="row">
        <div class="col">Скорость: ` + speed + `</div>
    </div>
    <div class="row">
        <div class="col">Координаты: ` + lt + "," + ln + `</div>
    </div>
    <div class="row">
        <div class="col text-wrap">Пересеченные геозоны: ` + geozones_names + `</div>
    </div>
    <div class="row">
        <div class="col">Пройдено с начала трека, км: ` + dist_now + `</div>
    </div>
</div>
`)
     }).addTo(pointsLayer);

     if (l % 25 == 0) {
      // рисуем каждую 2 точку - а то слишком много точек TODO - надо отдельный массив под это дело с точками.
      L.circleMarker([lt, ln], {
       radius: 3,
       weight: 1,
       fill: true,
       fillColor: "blue",
       fillOpacity: 1
      }).bindTooltip('').on('tooltipopen', function (e) {
       let tooltip = e.target.getTooltip();
       tooltip.setContent(`<div style="width:240px">
    <div class="row">
        <div class="col">` + object.name + `</div>
    </div>
    <hr>
    <div class="row">
        <div class="col">Скорость: ` + speed + `</div>
    </div>
    <div class="row">
        <div class="col">Координаты: ` + lt + "," + ln + `</div>
    </div>
    <div class="row">
        <div class="col text-wrap">Пересеченные геозоны: ` + geozones_names + `</div>
    </div>
    <div class="row">
        <div class="col">Пройдено с начала трека, км: ` + dist_now + `</div>
    </div>
</div>
`)}).addTo(pointsLayer2);
     }
     l += 2;
    }


    let courseLayer = new L.featureGroup();
    let courseLayer2 = new L.featureGroup();
    let courseLayer3 = new L.featureGroup();
    //speedarray
    // [0,40,60,90]
    l = 0;
    //for(let l in sResult.data){
    while (length > l) {
     let [lt, ln, speed, fix_date, course] = sResult.data[l];


     // тут еще рисуем каждую третью от верхних точек с направлением
     let [lt1, ln1, lt2, ln2] = [lt, ln, lt, ln];
     if (l === 0 && length > 1) {
      [lt2, ln2] = sResult.data[l + 1];
     } else {
      [lt1, ln1] = sResult.data[l - 1];
     }
     try {
      // получаем направление с учетом предыдущего или следующего значения
      course = this._getBearing(lt1, ln1, lt2, ln2);
      //console.log([lt1,ln1,lt2,ln2]);
      //console.log(course);
     } catch (e) {
      console.error(e);
      //console.log(e);
     }
     if (l % 15 === 0) {
      L.marker([lt, ln], {
       icon: this.directionicon,
       rotationAngle: course,
       renderer: this.mapInstance.myRenderer
      }).addTo(courseLayer);
     }
     if (l % 60 === 0) {
      L.marker([lt, ln], {
       icon: this.directionicon,
       rotationAngle: course,
       renderer: this.mapInstance.myRenderer
      }).addTo(courseLayer2);
     }

     if (l % 180 === 0) {
      L.marker([lt, ln], {
       icon: this.directionicon,
       rotationAngle: course,
       renderer: this.mapInstance.myRenderer
      }).addTo(courseLayer3);
     }

     l += 2;
    }

    queryLayers.push({
     layer: trackLayer,
     name: "track",
     visible: false,
     minZoom: 7
    });
    queryLayers.push({
     layer: pointsLayer,
     name: "point",
     visible: false,
     minZoom: 15,
    });
    queryLayers.push({
     layer: pointsLayer2,
     name: "point",
     visible: false,
     minZoom: 8,
     maxZoom: 14
    });
    queryLayers.push({
     layer: courseLayer,
     name: "point",
     visible: false,
     minZoom: 18
    });
    queryLayers.push({
     layer: courseLayer2,
     name: "point",
     visible: false,
     minZoom: 12,
     maxZoom: 17
    });
    queryLayers.push({
     layer: courseLayer3,
     name: "point",
     visible: false,
     minZoom: 7,
     maxZoom: 11
    });

    return queryLayers;

   },
   stops(sResult) {
    let self = this;
    let object = this.objects[sResult.objectId];
    let queryLayers = [];

    let length = sResult.data.length;
    let i=0;

    let stopsLayer = new L.featureGroup();

    for (let stop of sResult.data) {
     let lt = stop.latitude;
     let ln = stop.longitude;
     let ico = null;
     if (i === 0) {
      ico = this.parkinggreen;
     } else {
      if (i === (length - 1)) {
       ico = this.parkingpink;
      } else {
       ico = stop.duration > 5 ? this.parkingred : this.parkingblue;
      }
     }

     L.marker([lt, ln], {icon: ico}).bindPopup('').on('click', function (e) {
      let popup = e.target.getPopup();
      popup.setContent(`<div style="width:240px">
    <div class="row">
        <div class="col">Скорость начальная: </div>
    </div>
    <div class="row">
        <div class="col">Скорость конечная: </div>
    </div>
    <div class="row">
        <div class="col">Длительность: </div>
    </div>
</div>
`)
     }).addTo(stopsLayer)
      // .on('click', function (e) {
      //  console.log(e);
      //  console.log(stop);
      //  // self.playback.selectStop(stop);
      // });
     i++;
    }

    queryLayers.push({
     layer: stopsLayer,
     data: sResult.data,
     name: "point",
     visible: false,
     minZoom: 7,
    });

    return queryLayers;
   },
   // overspeed(sResult) {
   //  console.log("overspeed");
   //  console.log(sResult.data);
   //  if (sResult.status == true) {
   //   let queryLayers = [];
   //   return queryLayers;
   //  }
   // },
   overspeed2(sResult) {
    // console.log("overspeed2");
    // console.log(sResult.data);

    if (sResult.status === true) {
     let length = sResult.data.length;
     let queryLayers = [];
     let pointsLayer = new L.featureGroup();

     let l = 0;
     //for(let l in sResult.data){
     let distance_summ = 0;
     while (length > l) {
      let first =sResult.data[l].first;
      let last = sResult.data[l].last;

      let diff = moment.utc(moment(last.fix_date).diff(moment(first.fix_date))).format("HH:mm:ss")
      // console.log(diff);

      L.marker([first.latitude, first.longitude], {
       icon: this.overspeedIcon,
      }).bindTooltip('').on('tooltipopen', function (e) {
       let tooltip = e.target.getTooltip();
       tooltip.setContent(`<div style="width:240px">
    <div class="row">
        <div class="col">Скорость начальная: ` + first.speed + `</div>
    </div>
    <div class="row">
        <div class="col">Скорость конечная: ` + last.speed + `</div>
    </div>
    <div class="row">
        <div class="col">Длительность: ` + (diff) + `</div>
    </div>
</div>
`)
      }).addTo(pointsLayer);
      l++;
     }

     queryLayers.push({
      layer: pointsLayer,
      data: sResult.data,
      name: "point",
      visible: false,
      minZoom: 7,
     });
     return queryLayers;
    }
   },
   // From leafletPlayback
   _getBearing: function (startLat, startLong, endLat, endLong) {
    startLat = this._radians(startLat);
    startLong = this._radians(startLong);
    endLat = this._radians(endLat);
    endLong = this._radians(endLong);

    let dLong = endLong - startLong;

    let dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
    if (Math.abs(dLong) > Math.PI) {
     if (dLong > 0.0)
      dLong = -(2.0 * Math.PI - dLong);
     else
      dLong = (2.0 * Math.PI + dLong);
    }

    return (this._degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
   },
   _radians: function (n) {
    return n * (Math.PI / 180);
   },
   _degrees: function (n) {
    return n * (180 / Math.PI);
   },
   getSpeedIndex(speed) {
    let prev = 0;
    for(let i=1;i < this.getSpeedLimitsValue.length; i++){
     if(speed >= prev && speed < this.getSpeedLimitsValue[i]){
      return i-1;
     }else{
      prev = this.getSpeedLimitsValue[i];
     }
    }
    return this.getSpeedLimitsValue.length-1;
   },

   refreshObjectsInput(){
    if (Object.keys(this.objects).length > 0) {
     let key = Object.keys(this.objects)[0];
     this.selectedObjectId = this.objects[key].id;
    }
   }

  },

  mounted() {},

  created() {}

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