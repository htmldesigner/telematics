<template>
 <div class="player">
  <ul class="routes-list">
   <li class="tracker-result"
       v-for="(track, index) in 1"
       :key="index"
   >

    <div class="routes-target d-flex justify-content-between">
     <div class="initPlayer" @click="itemInit(track.id, index)"><p>{{track.name}}</p></div>
     <div class="route-remove mx-1">
      <label :for="'inputRemove' + index" class="m-0 p-0">
       <img :src="icon.remove" alt="Alt">
      </label>
      <input type="button" :id="'inputRemove' + index" class="d-none" @click="deleteTrack(index)">
     </div>
    </div>


    <div class="routes-navigation-panel mt-2 mb-2 align-items-center d-none" :id="'example' + index">
     <div class="play-button">
      <label :for="'inputPlay' + index" class="play-stop-icon m-0 p-0">
       <img v-if="play" :src="icon.pauseButton" alt="Alt">
       <img v-else :src="icon.playButton" alt="Alt">
      </label>
      <input type="button" :id="'inputPlay' + index" class="d-none" @click="onPlayPause">
     </div>

     <div class="col ">
      <Slider @change="onPlayBackSliderChange"
              :min="0"
              :max="500"
              v-model="comp_sliderValue"/>
      <!--      <span style="font-size: 10px">{{comp_sliderValue | moment('MM-DD-YYYY hh:mm')}}</span>-->
     </div>

     <select class="mr-2" v-model="comp_sliderSpeedValue">
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
   </li>
  </ul>


 </div>
</template>

<script>
 import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
 import moment from 'moment'
 import {eventBus} from '../eventBus'
 export default {

  name: "Player",
  components: {},
  data() {
   return {
    mapLayers: ['track', 'stop', 'overspeed', 'overspeed2'],
    mapTrackLayer: null,
    currentId: null,
    list: [],
    play: false,
    layers: {},
    trackLayer: new L.featureGroup(),
    result: {
     type: "LineString",
     coordinates: []
    },

    icon: {
     playButton: require('@/assets/play.svg'),
     pauseButton: '/img/pause.svg',
     remove: require('@/assets/remove.svg'),
    },

    sliderMin: null,
    sliderMax: null,
    sliderValue: null,
    sliderSpeedValue: 1,
    step: 500,
   }

  },
  computed: {

   ...mapState('mapModule', ['mapInstance']),
   ...mapState('playbackModule', ['playbackInstance']),
   comp_sliderSpeedValue: {
    set(val) {
     this.sliderSpeedValue = val;
     if (this.sliderSpeedValue >= 100) {
      this.step = 100000 / this.sliderSpeedValue
     }
    },
    get() {
     return this.sliderSpeedValue;
    }
   },
   comp_sliderValue: {
    set(val) {
     this.sliderValue = val - 0;
    },
    get() {
     return this.sliderValue
    }
   }

  },
  methods: {

   ...mapActions(['removeTrackInPlayer']),



   itemInit(id, index) {
    let element = document.querySelectorAll('#example' + index)
    if (element) {
     this.list.push(element)
    }
    this.list.forEach(elemets => {
     elemets.forEach(el => {
      el.classList.remove('d-flex')
     })
    })
    let elementOpen = document.querySelector('#example' + index)

    if (elementOpen) {
     elementOpen.classList.add('d-flex')
    } else {
     elementOpen.classList.remove('d-flex')
    }
    this.trackFilterforPayer(index)
    this.showTrack(index)
   },

   clear() {
    this.playbackInstance.clearData()
    this.sliderMin = 0
    this.sliderMax = 0
    this.sliderValue = 0
    this.comp_sliderSpeedValue = 1;
    this.play = false
    // this.result.coordinates = []
   },

   onPlayBackSliderChange(ms) {
    this.play = false
    this.playbackInstance.setCursor(this.sliderValue);
   },

   onPlayPause() {
    this.play = !this.play;
    if (this.play)
     return setTimeout(() => {
      this.onTimer()
     }, this.step)
   },

   onTimer() {
    if (this.play) {
     let newVal = this.sliderValue + this.step * this.sliderSpeedValue;
     if (newVal > this.sliderMax) {
      this.sliderValue = this.sliderMin;
      this.play = false;
     } else {
      this.sliderValue = newVal;
     }
     this.playbackInstance.setCursor(newVal);
     return setTimeout(() => {
      this.onTimer()
     }, this.step)
    }
   },


  },

  async mounted() {

  },
 }


</script>

<style scoped>
 .play-stop-icon img {
  height: 30px;
 }

 .objectSelector label {
  margin: 0 20px 0 0;
  padding: 0;
 }

 .routes-list{
  padding: 0 15px;
  margin: 0;

 }

 .routes-list li{
  /*padding: 0 5px;*/
  list-style: none;

 }

 .tracker-result {
  border-bottom: 1px solid #c2c2c2;
  margin-bottom: 5px;
  width: 100%;

 }

 .routes-target {
  background-color: #f5f5f5;
  padding: 5px 10px;
  margin: 0 0 1px 0;
 }

 .routes-target p {
  padding: 0;
  margin: 0;
  font-size: 14px;
 }

 .initPlayer {
  width: 100%;
  cursor: pointer;
 }

 .route-remove {
  z-index: 9999;
 }
</style>