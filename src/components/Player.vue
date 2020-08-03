<template>
 <div class="player">
  <ul class="routes-list">
   <li class="tracker-result" v-for="(track, index) in tracks" :key="index">

    <div class="routes-target d-flex justify-content-between">
     <p>{{track.info.name}}</p>
     <span>{{comp_sliderValue | moment('MM-DD-YYYY hh:mm')}}</span>
     <div class="route-remove mx-1">
      <label :for="'inputRemove' + index" class="m-0 p-0">
       <img :src="icon.remove" alt="Alt">
      </label>
      <input type="button" :id="'inputRemove' + index" class="d-none" @click="removeTrack">
     </div>
    </div>

    <div class="routes-navigation-panel d-flex mt-2 mb-2 align-items-center">
     <div class="play-button">
      <label :for="'inputPlay' + index" class="play-stop-icon m-0 p-0">
       <img v-if="track.info.play" :src="icon.pauseButton" alt="Alt">
       <img v-else :src="icon.playButton" alt="Alt">
      </label>
      <input type="button" :id="'inputPlay' + index" class="d-none" @click="playbackLoad">
     </div>

     <div class="col">
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
   </li>
  </ul>


 </div>
</template>

<script>
 import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
 import moment from 'moment'
 export default {

  name: "Player",
  components: {},
  data() {
   return {
    playbackTracks: null,
    icon: {
     playButton: '/img/playBig.svg',
     pauseButton: '/img/pause.svg',
     remove: '/img/remove.svg',
     // stop: '/img/stops.svg',
     // stop_off: '/img/stops-off.svg',
     // speed: '/img/speedings.svg',
     // speed_off: '/img/speedings-off.svg',
     // parking: '/img/parkings.svg',
     // parking_off: '/img/parkings-off.svg',
     // filling: '/img/fillings.svg',
     // filling_off: '/img/fillings-off.svg',

     // pdf: '/img/pdf_icon.svg',
     // exel: '/img/excel-file.svg',
     // printer: '/img/printer.svg',
    },
    sliderMin: null,
    sliderMax: null,
    sliderValue: null,

    sliderSpeedValue: 1,
    step: 500,
   }

  },
  computed: {
   ...mapGetters({
    tracks: 'getTracks'
   }),
   ...mapState('mapModule', ['mapInstance']),
   ...mapState('playbackModule', ['playbackInstance']),
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
   clear() {
    this.playback.clearData();
    this.sliderMin = new Date().getTime() - 10000;
    this.sliderMax = new Date().getTime() + 10000;
    this.sliderValue = new Date().getTime();
    this.comp_sliderSpeedValue = 1;
    this.playbackTracks = {};

    this.track = [];
    this.stops = [];
    this.speedList = [];
    this.speedListOver = [];
    this.step = 500;
   },
   onPlayBackSliderChange(ms) {
    this.playbackInstance.setCursor(this.sliderValue);
   },


   removeTrack() {
    console.log('removeTrack')
   },

   async playbackLoad() {

    //let tracks = JSON.parse(tracks);
    this.playbackTracks = {
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



    let playBackTrack = null
    for (let i in this.tracks) {
     if (this.tracks[i]) {
      playBackTrack = Object.filter(this.tracks[i].data, el => {
       return el.queryType === 'track'
      })
     }
    }

    for (let i in playBackTrack) {
     this.LatLng(playBackTrack[i].data)
    }


  await this.playbackInstance.addData(this.playbackTracks);

   },

   LatLng(points) {
    for (let i in points) {
     this.playbackTracks.geometry.coordinates.push([points[i][1], points[i][0]])
     this.playbackTracks.properties.speed.push(points[i][2]);
     this.playbackTracks.properties.time.push(points[i][3]);
    }

    // this.sliderMin = this.playbackInstance.getStartTime()
    // this.sliderMax = this.playbackInstance.getEndTime();

    this.sliderValue = this.playbackTracks.properties.time[0]
    this.sliderMin = this.playbackTracks.properties.time[0]
    this.sliderMax = this.playbackTracks.properties.time[this.playbackTracks.properties.time.length - 1];

   },

  },



  mounted() {

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

 .tracker-result {
  border-bottom: 1px solid #c2c2c2;
  margin-bottom: 10px;
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
</style>