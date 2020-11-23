<template>
 <div class="player" v-if="getPlayBackData">
  <ul class="routes-list">
   <li class="tracker-result">

    <div class="routes-navigation-panel mt-2 mb-2 align-items-center d-flex" id="example">

     <div class="play-button">
      <label for="inputPlay" class="play-stop-icon m-0 p-0">
       <img v-if="play" :src="icon.pauseButton" alt="Alt">
       <img v-else :src="icon.playButton" alt="Alt">
      </label>
      <input type="button" id="inputPlay" class="d-none" @click="onPlayPause">
     </div>

     <div class="col ">
      <Slider @change="onPlayBackSliderChange"
              :min="sliderMin"
              :max="sliderMax"
              v-model="comp_sliderValue"/>
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

    <div class="routes-target d-flex">
     <div class="route-remove mx-1">
      <span style="font-size: 12px">{{comp_sliderValue | moment('MM-DD-YYYY HH:mm')}}</span>
     </div>
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
    play: false,
    icon: {
     playButton: require('@/assets/play.svg'),
     pauseButton: require('@/assets/pause.svg'),
     remove: require('@/assets/remove.svg'),
    },

    sliderMin: new Date().getTime() - 10000,
    sliderMax: new Date().getTime() + 10000,
    sliderValue: new Date().getTime(),

    sliderSpeedValue: 1,
    step: 500,
   }

  },
  computed: {

   ...mapState('mapModule', ['mapInstance']),
   ...mapState('playbackModule', ['playbackInstance']),

   ...mapGetters({
    getPlayBackData: 'getPlayBackData'
   }),

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

  watch: {
   getPlayBackData: {
    handler(val) {
     this.playbackLoad(val)
    }
   }
  },

  methods: {

   ...mapMutations(['SETPLAYBACKDATA']),

   playbackLoad(obj) {

    this.clear() // Clear playback

    if (obj?.length > 1) {

     let playbackTracks = {
      "type": "Feature",
      "geometry": {
       "type": "MultiPoint",
       "coordinates": []
      },
      "properties": {
       "time": [],
       "speed": []
      }
     };

     let startTime = 0;
     let endTime = 0;
     let prev = 0;
     for (let point of obj) {

      let date = point[3];

      let speed = point[2];
      if (prev === date) {
       continue;
      }
      date = moment(date).valueOf();
      playbackTracks.geometry.coordinates.push([point[1], point[0]]);
      playbackTracks.properties.time.push(date);
      playbackTracks.properties.speed.push(speed);

      if (startTime === 0) {
       startTime = date;
       endTime = date;
      }
      if (date > endTime) {
       endTime = date;
      }
      if (date < startTime) {
       startTime = date;
      }
      prev = date;
     }

     this.playbackInstance.addData(playbackTracks);

     this.playbacksetup()

    } else {
     console.log('showmessage', "Отсутствуют данные перемещения", 'info')
    }
   },

   playbacksetup() {
    let startTime = this.playbackInstance.getStartTime();
    this.sliderMin = startTime;
    this.sliderMax = this.playbackInstance.getEndTime();
    this.sliderValue = startTime;
   },

   clear() {
    this.playbackInstance.clearData()
    this.sliderMin = new Date().getTime() - 10000
    this.sliderMax = new Date().getTime() + 10000
    this.sliderValue = new Date().getTime()
    this.comp_sliderSpeedValue = 1
    this.play = false
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
  mounted() {
   eventBus.$on('map-Clear', () => {
    this.SETPLAYBACKDATA(null)
   });
  }

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

 .routes-list {
  padding: 0 15px;
  margin: 0;

 }

 .routes-list li {
  /*padding: 0 5px;*/
  list-style: none;

 }

 .tracker-result {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
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