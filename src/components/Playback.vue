<template>
 <div>
  <div class="row">
   <div class="col" style="padding-top: 14px;">
    <select v-model="comp_sliderSpeedValue">
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
  </div>
  <div class="row">
   <div class="col" style="padding: 14px;">

     <input type="range" class="form-control-range" id="formControlRange"
            :min="sliderMin"
            :max="sliderMax"
     >
{{comp_sliderSpeedValue}}
  </div>
  </div>
 </div>
</template>

<script>
 import {mapState} from "vuex";

 export default {
  name: "Playback",
  data(){
   return {
    sliderMin: new Date().getTime() - 10000,
    sliderMax: new Date().getTime() + 10000,
    sliderValue: new Date().getTime(),
    sliderSpeedValue: 1,
    step: 500,
    play: false,
    selectedStop:[],
    selectedSpeed:[],
    tab: 'stops',
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   comp_sliderSpeedValue:{
    set(val){
     this.sliderSpeedValue = val-0;
     if (this.sliderSpeedValue >= 100){
      this.step = 10000/(this.sliderSpeedValue-0)
     }
    },
    get() {
     return this.sliderSpeedValue;
    }
   },
  },
mounted() {
 this.$utils.playback.playback(this.mapInstance)
}
 }
</script>

<style scoped>

</style>