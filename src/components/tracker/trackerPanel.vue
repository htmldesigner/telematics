<template>
 <div class="playback-container">

  <div class="playback-toolbars  d-flex justify-content-between align-items-center px-2 py-1">

   <div class="playback-control d-flex">

    <div class="tracker-speed-selector mx-1" v-tooltip="'Данные по привышению'">
     <input v-model="boolOverspeed"
            class="form-check-inputd d-none"
            type="button"
            value=""
            id="boolOverspeed11"
            @click="checkComponent('overSpeedRaport')"
     >
     <label class="form-check-label" for="boolOverspeed11">
      <img :src="icon.speed" alt="alt">
      <!--      <img v-else :src="icon.speed_off" alt="alt">-->
     </label>
    </div>

    <div class="tracker-stop-selector mx-1" v-tooltip="'Данные по остановкам'">
     <input v-model="boolStops"
            class="form-check-input d-none"
            type="button"
            value=""
            id="boolStops"
            @click="checkComponent('stopRaport')"
     >
     <label class="form-check-label" for="boolStops">
      <img :src="icon.parking" alt="alt">
      <!--      <img v-else :src="icon.stop_off" alt="alt">-->
     </label>
    </div>

   </div>


   <div class="playback-toolbar d-flex align-items-center">

<!--    <div class="export-pdf mx-2">-->
<!--     <label for="inputButtonPdf11" class="m-0"><img :src="icon.pdf" alt="Alt"></label>-->
<!--     <input type="button" id="inputButtonPdf11" class="d-none" @click="downloadPdf">-->
<!--    </div>-->

<!--    <div class="export-exel mx-2">-->
<!--     <label for="inputButtonExel11" class="m-0"><img :src="icon.exel" alt="Alt"></label>-->
<!--     <input type="button" id="inputButtonExel11" class="d-none">-->
<!--    </div>-->

<!--    <div class="export-printer mx-2">-->
<!--     <label for="inputButtonPrinter11" class="m-0"><img :src="icon.printer" alt="Alt"></label>-->
<!--     <input type="button" id="inputButtonPrinter11" class="d-none">-->
<!--    </div>-->

    <div class="clear mx-1">
     <button type="button" class="btn-custom-outline px-2 py-0" @click="clearRaport">
      <span>Очистить</span>
     </button>
    </div>

   </div>

  </div>

  <keep-alive>
   <component
    :is="currentComponent"
    :stops="stops"
    :overSpeeds="overSpeeds"
    ref="raportComponent"
   >
   </component>
  </keep-alive>

 </div>


</template>

<script>
 import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
 import stopRaport from "./stopRaport";
 import overSpeedRaport from "./overspeedRaport";
 import {eventBus} from "../../eventBus";

 export default {
  name: "trackerPanel",
  components: {
   stopRaport,
   overSpeedRaport,
  },
  data() {
   return {
    currentComponent: 'overSpeedRaport',
    icon: {
     stop: require('@/assets/stops.svg'),
     stop_off: require('@/assets/stops-off.svg'),
     speed: require('@/assets/speedings.svg'),
     speed_off: require('@/assets/speedings-off.svg'),
     parking: require('@/assets/parkings.svg'),
     parking_off: require('@/assets/parkings-off.svg'),
     filling: require('@/assets/fillings.svg'),
     filling_off: require('@/assets/fillings-off.svg'),
     playButton: require('@/assets/playBig.svg'),
     pauseButton: require('@/assets/pause.svg'),
     remove: require('@/assets/remove.svg'),
     pdf: require('@/assets/pdf_icon.svg'),
     exel: require('@/assets/excel-file.svg'),
     printer: require('@/assets/printer.svg'),
     road: require('@/assets/track.svg'),
    },

    boolOverspeed: true,
    boolStops: true,
   }
  },
  computed: {
   ...mapGetters({
    stops: 'getStop',
    overSpeeds: 'getOverSpeedTrack'
   })
  },

  methods: {
   ...mapActions(['clearTrackRaport']),

   checkComponent(value){
    this.currentComponent = value
    if (value === 'overSpeedRaport'){
     eventBus.$emit('showStopLayer', 'overSpeedRaport')
    }

    if (value === 'stopRaport'){
     eventBus.$emit('showStopLayer', 'stopRaport')
    }
   },


   clearRaport() {
    this.$store.dispatch('clearTracksRaport')
   },

   downloadPdf() {
    this.$refs.raportComponent.createPDF()
   }

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