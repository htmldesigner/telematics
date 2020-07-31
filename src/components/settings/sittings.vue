<template>
 <div class="sittings-container mt-4">
  <div class="container">

   <div class="row">
    <div class="col">
     <div class="custom-control custom-switch">
      <input type="checkbox" class="custom-control-input" v-model="isRealTime" id="customSwitch1">
      <label class="custom-control-label" for="customSwitch1">Следить в реальном времени:</label>
     </div>
    </div>
   </div>

   <div class="row mt-3">
    <div class="col d-flex w-auto justify-content-between">
     <label for="exampleInputNumber1">Период обновления, сек:</label>
     <input id="exampleInputNumber1" class="text-center" type="number" min="1" max="100" v-model="timerInterval"
            v-bind:disabled="!isRealTime"/>
    </div>
   </div>

   <div class="row mt-3">
    <div class="col d-flex w-auto justify-content-between"">
     <label for="exampleInputNumber2" class="mr-5">Мин. радиус остановки, м:</label>
     <input id="exampleInputNumber2" class="text-center" type="number" min="1" max="100"/>
    </div>
   </div>

   <div class="row mt-3">
    <div class="col d-flex w-auto justify-content-between">
     <label for="exampleInputNumber3" class="mr-5">Мин. длительность остановки, мин:</label>
     <input id="exampleInputNumber3" class="text-center" type="number" min="1" max="100"/>
    </div>
   </div>

  <hr>

   <div class="row">

    <div class="col">
     Скорость:
    </div>
    <div class="col">
     Цвет:
    </div>

    <div class="col text-nowrap">
     <button type="button" class="btn btn-secondary" v-on:click.prevent="addSpeed">
      <span class="glyphicon glyphicon-trash">+</span>
     </button>
    </div>
   </div>

   <setupspeed v-for="(speed, index) of speedindex" :key="index"
               v-bind:index="index" v-bind:value="speed"
               v-on:delete="deleteSpeed"
               v-on:save="saveSpeed"
   ></setupspeed>

   <div class="row mt-3">
    <div class="col">
     <button class="btn-custom float-right" @click="saveConfig">Сохранить</button>
    </div>
   </div>

  </div>
 </div>

</template>

<script>
 import {mapGetters, mapActions, mapMutations} from 'vuex'
import setupspeed from "./setupspeed";
 export default {
  name: "sittings",
  components: {
   setupspeed
  },
  data() {
   return {
    speedindex: [
     {"speed": 0, color: "#0000ff"}
    ]
   }
  },
  computed: {
   ...mapGetters({
    realtime: 'isRealTime',
    getTimerInterval: 'getTimerInterval',
   }),
   isRealTime: {
    set(val) {
     this.setRealTime(val);
    },
    get() {
     return this.realtime;
    }
   },
   timerInterval: {
    set(val) {
     this.setTimerInterval(val);
    },
    get() {
     return this.getTimerInterval;
    }
   },
  },
  methods: {
   ...mapMutations(['setRealTime', 'setTimerInterval']),
   saveConfig() {
    this.saveState({
     speedindex : this.speedindex,
     isRealTime: this.isRealTime,
     stopMinradius: this.stopMinradius,
     stopMinduration:this.stopMinduration,
     timerInterval:this.timerInterval,
    })
    this.setSpeedLimits(this.speedindex);
   },
   saveSpeed(data) {
    //console.log(data);
    this.speedindex[data.index].speed=data.speed;
    this.speedindex[data.index].color=data.color;
    //
   },
   deleteSpeed(index) {
   },
   getMaxSpeed() {
    let max = 0;

    for (let si of this.speedindex) {
     if (max < si.speed-0) {
      max = si.speed-0;
     }
    }
    return max;
   },
   addSpeed() {
    this.speedindex.push({"speed": this.getMaxSpeed() + 1, color: "#0000ff"});
   },
  }
 }
</script>

<style scoped>

</style>