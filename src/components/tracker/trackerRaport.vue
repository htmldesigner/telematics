<template>
 <div class="playback-container">

  <div class="playback-toolbars  d-flex justify-content-between align-items-center px-2 py-2">

   <div class="playback-control d-flex">

    <div class="tracker-stop-selector mx-1" title="Маршрут">

     <input v-model="allTrack"
            class="form-check-input d-none"
            type="button"
            value=""
            id="allTrack"
            @click="currentComponent = 'allTrack'"
     >
     <label class="form-check-label" for="allTrack">
      all
<!--      <img  :src="icon.parking" alt="alt">-->
      <!--      <img v-else :src="icon.stop_off" alt="alt">-->
     </label>
    </div>

    <div class="tracker-stop-selector mx-1" title="Остановки">

     <input v-model="boolStops"
            class="form-check-input d-none"
            type="button"
            value=""
            id="boolStops"
            @click="currentComponent = 'stopRaport'"
     >
     <label class="form-check-label" for="boolStops">
      <img  :src="icon.parking" alt="alt">
      <!--      <img v-else :src="icon.stop_off" alt="alt">-->
     </label>
    </div>

    <div class="tracker-speed-selector mx-1" title="Привышения">
     <input v-model="boolOverspeed"
            class="form-check-inputd d-none"
            type="button"
            value=""
            id="boolOverspeed11"
            @click="currentComponent = 'overspeedRaport'"
     >
     <label class="form-check-label" for="boolOverspeed11">
      <img :src="icon.speed" alt="alt">
      <!--      <img v-else :src="icon.speed_off" alt="alt">-->
     </label>
    </div>

<!--    <div class="tracker-parking-selector mx-1" title="Парковки">-->
<!--     <input  class="form-check-input d-none" type="checkbox" value="" id="boolParking11">-->
<!--     <label class="form-check-label" for="boolParking11">-->
<!--      <img  :src="icon.parking" alt="alt">-->
<!--&lt;!&ndash;      <img v-else :src="icon.parking_off" alt="alt">&ndash;&gt;-->
<!--     </label>-->
<!--    </div>-->

<!--    <div class="tracker-fillings-selector mx-1" title="Заправки">-->
<!--     <input  class="form-check-input d-none" type="checkbox" value="" id="boolFilling11">-->
<!--     <label class="form-check-label" for="boolFilling11">-->
<!--      <img  :src="icon.filling" alt="alt">-->
<!--&lt;!&ndash;      <img v-else :src="icon.filling_off" alt="alt">&ndash;&gt;-->
<!--     </label>-->
<!--    </div>-->

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
     <button type="button" class="btn-custom-outline px-2 py-0" @click="clearRaport">
      <span>Очистить</span>
     </button>
    </div>

   </div>

  </div>

  <keep-alive>
   <component :is="currentComponent"></component>
  </keep-alive>

 </div>


</template>

<script>
 import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
 import stopRaport from "./stopRaport";
 import overspeedRaport from "./overspeedRaport";
 import allTrack from "./allTrack";

 export default {
  name: "trackerRaport",
  components: {
   stopRaport,
   overspeedRaport,
   allTrack,
  },
  data() {
   return {
    currentComponent: 'allTrack',
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

    boolOverspeed: true,
    boolStops: true,
    allTrack: true,

   }
  },
  computed: {},

  methods: {
   ...mapActions(['clearTrackRaport']),

   clearRaport(){
    this.clearTrackRaport()
   }
  },
  mounted() {
   // console.log('asa')
  },

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

 .play-button img {
  width: 30px;
 }

 table thead {
  background-color: #efefef;
 }

 .table-bordered th {
  font-weight: normal;
 }

</style>