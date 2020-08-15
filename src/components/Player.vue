<template>
 <div class="player">
  <ul class="routes-list">
   <li class="tracker-result"
       v-for="(track, index) in layers"
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
              :min="sliderMin"
              :max="sliderMax"
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
     playButton: '/img/playBig.svg',
     pauseButton: '/img/pause.svg',
     remove: '/img/remove.svg',
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

   trackFilterforPayer(index) {
    for (let layer of this.layers[index].layers) {
     switch (layer.type) {
      case "stop":
       this.$store.dispatch('setStopRaport', layer.data)
       break;
      case "overspeed2":
       this.$store.dispatch('setOverSpeedRaport', layer.data)
       break;
      case "playback":
       this.clear();
       this.playbackInstance.clearData();
       this.playbackLoad(layer.data);
       this.$store.dispatch('setAllTrackRaport', layer.data)
       break;
     }
    }
   },

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

   async playbackLoad(obj) {
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

    for (let point of obj.data) {
     let date = point[3];
     let speed = point[2];
     this.playbackTracks.geometry.coordinates.push([point[1], point[0]]);
     this.playbackTracks.properties.time.push(date);
     this.playbackTracks.properties.speed.push(speed);
     this.makeGeoJson(point[1], point[0])
    }

    this.sliderValue = this.playbackTracks.properties.time[0]
    this.sliderMin = this.playbackTracks.properties.time[0]
    this.sliderMax = this.playbackTracks.properties.time[this.playbackTracks.properties.time.length - 1];

    this.playbackInstance.addData(this.playbackTracks);
   },

   makeGeoJson(lt, ln) {
    this.result.coordinates.push([lt, ln]);
   },

   addTrack(layer) {
    Vue.set(this.layers, layer.id, layer);
   },

   showTrack(index) {
    let old = this.currentId;
    this.currentId = index;
    if (index === old) {
     return;
    }
    if (old != null) {
     this.hideTrack(old);
    }
    this.layers[index].visible = true;
    // цикл по сервисрезалт
    for (let servicelayer of this.layers[index].layers) {
     // цикл по внутренним слоям, например у трека
     if (this.mapLayers.indexOf(servicelayer.type) >= 0) {
      for (let layer of servicelayer.data) {
       if (!this.mapTrackLayer.hasLayer(layer.layer)) {
        layer.layer.addTo(this.mapTrackLayer);
       }
      }
     }
    }

    this.mapInstance.setZoom(10)
    this.OnMapZoomEnd(this.mapInstance);
    try {
     this.mapInstance.flyToBounds(this.mapTrackLayer.getBounds()) // полет к выделенному
    } catch (ex) {
     console.error(ex);
    }
   },

   hideTrack(index) {
    this.layers[index].visible = false;
    for (let servicelayer of this.layers[index].layers) {
     // цикл по внутренним слоям, например у трека
     if (this.mapLayers.indexOf(servicelayer.type) >= 0) {
      for (let layer of servicelayer.data) {
       if (this.mapTrackLayer.hasLayer(layer.layer)) {
        this.mapTrackLayer.removeLayer(layer.layer);
       }
      }
     }
    }
   },

   deleteTrack(index) {
    if (index === this.currentId) {
     this.currentId = null;
     this.clear()
    }

    this.layers[index].visible = false;

    for (let servicelayer of this.layers[index].layers) {
     // цикл по внутренним слоям, например у трека
     if (this.mapLayers.indexOf(servicelayer.type) >= 0) {
      for (let layer of servicelayer.data) {
       if (this.mapTrackLayer.hasLayer(layer.layer)) {
        this.mapTrackLayer.removeLayer(layer.layer);
       }
      }
     }
    }
    Vue.delete(this.layers, index)
    // this.$store.dispatch('clearTrackRaport')
   },

   OnMapZoomEnd(map) {
    const z = map.getZoom()
    let keys = Object.keys(this.layers);
    for (let key of keys) { // every query
     let querylayer = this.layers[key];
     if (querylayer.visible) {
      for (let serviceLayer of querylayer.layers) { // everyService in query
       if (this.mapLayers.indexOf(serviceLayer.type) >= 0) {
        for (let layer of serviceLayer.data) {
         // layer.layer[layerIndex].addTo(this.mapTrackLayer);
         let minZoom = layer.minZoom
         let maxZoom = layer.maxZoom || 30
         if (z < minZoom || z > maxZoom) {
          // быть не должно, удаляем если есть
          if (this.mapTrackLayer.hasLayer(layer.layer)) {
           this.mapTrackLayer.removeLayer(layer.layer);
          }
         } else {
          // тут слой должен быть. добавляем если нет.
          if (!this.mapTrackLayer.hasLayer(layer.layer)) {
           this.mapTrackLayer.addLayer(layer.layer);
          }
         }
        }
       }
      }
     }
    }
   },
  },

  async mounted() {
   this.mapTrackLayer = await new L.featureGroup();
   this.mapTrackLayer.addTo(this.mapInstance).bringToFront();
   eventBus.$on('mapzoomend', this.OnMapZoomEnd);

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