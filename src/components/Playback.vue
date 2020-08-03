<template>
 <div class="playback-container">

  <div class="playback-toolbars  d-flex justify-content-between align-items-center px-2 py-2">

<!--   <div class="player d-flex w-75 ml-1">-->

<!--    <div class="play-button">-->
<!--     <label for="inputPlay1" class="m-0 p-0">-->
<!--      <img v-if="play" :src="icon.pauseButton" alt="Alt">-->
<!--      <img v-else :src="icon.playButton" alt="Alt">-->
<!--     </label>-->
<!--     <input type="button" id="inputPlay1" class="d-none" @click="play = !play, onPlayPause()">-->
<!--    </div>-->

<!--    <input type="range" class="form-control-range ml-2" id="formControlRange"-->
<!--           :min="sliderMin"-->
<!--           :max="sliderMax"-->
<!--           v-model="comp_sliderValue"-->
<!--    >-->
<!--    <div class="col" style="padding-top: 14px;">-->
<!--     <span class="font-weight-light" v-html="sliderValueDate"></span>-->
<!--    </div>-->
<!--    <select class="ml-4" v-model="comp_sliderSpeedValue">-->
<!--     <option value="1">1x</option>-->
<!--     <option value="2">2x</option>-->
<!--     <option value="5">5x</option>-->
<!--     <option value="10">10x</option>-->
<!--     <option value="20">20x</option>-->
<!--     <option value="50">50x</option>-->
<!--     <option value="100">100x</option>-->
<!--     <option value="200">200x</option>-->
<!--     <option value="500">500x</option>-->
<!--     <option value="1000">1000x</option>-->
<!--    </select>-->

<!--   </div>-->


    <div class="playback-control d-flex">

     <div class="tracker-stop-selector mx-1" title="Остановки">
      <input v-model="boolStops" class="form-check-input d-none" type="checkbox" value="" id="boolStops">
      <label class="form-check-label" for="boolStops">
       <img v-if="boolStops" :src="icon.stop" alt="alt">
       <img v-else :src="icon.stop_off" alt="alt">
      </label>
     </div>

     <div class="tracker-speed-selector mx-1" title="Привышения">
      <input v-model="boolOverspeed" class="form-check-input d-none" type="checkbox" value="" id="boolOverspeed11">
      <label class="form-check-label" for="boolOverspeed11">
       <img v-if="boolOverspeed" :src="icon.speed" alt="alt">
       <img v-else :src="icon.speed_off" alt="alt">
      </label>
     </div>

     <div class="tracker-parking-selector mx-1" title="Парковки">
      <input v-model="boolParking" class="form-check-input d-none" type="checkbox" value="" id="boolParking11">
      <label class="form-check-label" for="boolParking11">
       <img v-if="boolParking" :src="icon.parking" alt="alt">
       <img v-else :src="icon.parking_off" alt="alt">
      </label>
     </div>

     <div class="tracker-fillings-selector mx-1" title="Заправки">
      <input v-model="boolFilling" class="form-check-input d-none" type="checkbox" value="" id="boolFilling11">
      <label class="form-check-label" for="boolFilling11">
       <img v-if="boolFilling" :src="icon.filling" alt="alt">
       <img v-else :src="icon.filling_off" alt="alt">
      </label>
     </div>
    </div>



   <div class="playback-toolbar d-flex align-items-center">

    <div class="export-pdf mx-2">
     <label for="inputButtonPdf11" class="m-0"><img :src="icon.pdf" alt="Alt"></label>
     <input type="button" id="inputButtonPdf11" class="d-none">
    </div>

    <div class="export-exel mx-2">
     <label for="inputButtonExel11" class="m-0"><img :src="icon.exel" alt="Alt"></label>
     <input type="button" id="inputButtonExel11" class="d-none">
    </div>

    <div class="export-printer mx-2">
     <label for="inputButtonPrinter11" class="m-0"><img :src="icon.printer" alt="Alt"></label>
     <input type="button" id="inputButtonPrinter11" class="d-none">
    </div>

    <div class="clear mx-1">
     <button type="button" class="btn-custom-outline px-2 py-0">
      <span>Очистить</span>
     </button>
    </div>

   </div>

  </div>


   <div class="playback-raport w-100">
    <table class="table table-hover table-bordered">
     <thead>
     <tr>
      <th scope="col">Дата</th>
      <th scope="col">Продолжительность</th>
      <th scope="col">Пробег км.</th>
      <th scope="col">Адресс</th>
     </tr>
     </thead>
     <tbody>
     <tr>
      <th scope="row">{{ new Date() | moment('YYYY-MM-DD') }}</th>
      <td>4 часа 49 мин</td>
      <td>123</td>
      <td>ул. Советская, 78</td>
     </tr>
     <tr>
     <tr>
      <th scope="row">{{ new Date() | moment('YYYY-MM-DD') }}</th>
      <td>1 час</td>
      <td>56</td>
      <td>ул. Ленина, 96</td>
     </tr>
     <tr>
     <tr>
      <th scope="row">{{ new Date() | moment('YYYY-MM-DD') }}</th>
      <td>8 мин</td>
      <td>7,42</td>
      <td>ул. Коммунистическая, 2</td>
     </tr>
     </tbody>
    </table>
   </div>

  </div>




</template>

<script>
 import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
 import {eventBus} from '../eventBus'

 export default {
  name: "Playback",
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
     playButton: '/img/playBig.svg',
     pauseButton: '/img/pause.svg',
     remove: '/img/remove.svg',
     pdf: '/img/pdf_icon.svg',
     exel: '/img/excel-file.svg',
     printer: '/img/printer.svg',
    },
    play: false,
    boolOverspeed: true,
    boolStops: false,
    boolParking: true,
    boolFilling: true,

    map: null,
    playback: null,

    sliderMin: new Date().getTime() - 10000,
    sliderMax: new Date().getTime() + 10000,

    sliderValue: new Date().getTime(),

    sliderSpeedValue: 1,
    step: 500,
    play: false,
    selectedStop: [],
    selectedSpeed: [],
    tab: 'stops',
   }
  },
  computed: {
   // ...mapState('playbackModule', ['playbackInstance']),
   ...mapGetters({
    tracks: 'getTracks',
   }),
   comp_sliderSpeedValue: {
    set(val) {
     this.sliderSpeedValue = val - 0;
     if (this.sliderSpeedValue >= 100) {
      this.step = 10000 / (this.sliderSpeedValue - 0)
     }
    },
    get() {
     return this.sliderSpeedValue;
    }
   },
   sliderValueDate() {
    return new Date(this.sliderValue - 0).toLocaleDateString() + " " + new Date(this.sliderValue - 0).toLocaleTimeString()
   },
   comp_sliderValue: {
    set(val) {
     //if (!this.play) {
     this.sliderValue = val - 0;
     //}
    },
    get() {
     return this.sliderValue
    }
   }
  },
  methods: {
   ...mapMutations('playbackModule', ['SET_PLAYBACK_INSTANCE']),
   ...mapState('mapModule', ['mapInstance']),
   ...mapState('playbackModule', ['playbackInstance']),

   createPlaybackInstance() {

    let playbackOptions = {
     playControl: false,
     dateControl: false,
     sliderControl: false,
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
        iconSize: [40, 48], // size of the icon
        shadowSize: [0, 0], // size of the shadow
        iconAnchor: [20, 24], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0], // the same for the shadow
        popupAnchor: [10, 10] // point from which the popup should open relative to the iconAnchor
       }),
       zIndexOffset: 10100
      }
     },


    };


    this.playback = new L.Playback(this.mapInstance(), [], null, playbackOptions);
    this.playback.test = this.test

    return this.playback

   },

   test(e) {
    console.log(e)
   },

   onPlayPause() {
    if (this.play)
     console.log('play')
   },

   run() {
    this.playbackInstance().test(this.playback)
   },

   renderPlayback() {
    this.SET_PLAYBACK_INSTANCE(this.createPlaybackInstance())
   },

  },
  mounted() {
   // this.renderPlayback()
  },
  beforeCreate() {

  }

 }
</script>

<style scoped>
 .playback-container {
  height: 100%;
 }

 .playback-panel {

 }

 /*.playback-control {*/
 /* display: inline-block;*/
 /* height: 100%;*/
 /* background-color: #efefef;*/
 /* padding: 6px;*/
 /* border-top: 1px solid #d4d4d4;*/
 /* border-right: 1px solid #d4d4d4;*/
 /* border-left: 1px solid #d4d4d4;*/
 /*}*/

 .play-button img{
  width: 30px;
 }

 table thead {
  background-color: #efefef;
 }

 .table-bordered th {
  font-weight: normal;
 }

</style>