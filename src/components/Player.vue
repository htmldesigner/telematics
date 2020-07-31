<template>
 <div class="player d-flex mx-2 align-items-center">

  <div class="play-button">
   <label for="inputPlay1" class="m-0 p-0">
    <img v-if="play" :src="icon.pauseButton" alt="Alt">
    <img v-else :src="icon.playButton" alt="Alt">
   </label>
   <input type="button" id="inputPlay1" class="d-none" @click="play = !play, onPlayPause()">
  </div>

  <input type="range" class="form-control-range ml-2" id="formControlRange"
         :min="sliderMin"
         :max="sliderMax"
         v-model="comp_sliderValue"
  >

  <select class="ml-4" v-model="comp_sliderSpeedValue">
   <option value="1">1x</option>
   <option value="2">2x</option>
   <option value="5">5x</option>
   <option value="10">10x</option>
   <option value="20">20x</option>
   <option value="50">50x</option>
   <option value="100">100x</option>
   <option value="200">200x</option>
   <option value="500">500x</option>
   <option value="1000">1000x</option>
  </select>

 </div>
</template>

<script>
 import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';

 export default {

  name: "Player",
  components: {},
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

   renderPlayback() {
    this.SET_PLAYBACK_INSTANCE(this.createPlaybackInstance())
   },

  },



  mounted() {
   this.renderPlayback()
  },
 }


</script>

<style scoped>

</style>