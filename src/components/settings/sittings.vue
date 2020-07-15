<template>
 <div class="sittings-container">
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
    <div class="col">
     <label for="exampleInputNumber1" class="mr-5">Период обновления, сек:</label>
     <input id="exampleInputNumber1" class="text-center" type="number" min="1" max="100" v-model="timerInterval"
            v-bind:disabled="!isRealTime"/>
    </div>
   </div>

   {{isRealTime, timerInterval}}
  </div>
 </div>

</template>

<script>
 import {mapGetters, mapActions, mapMutations} from 'vuex'

 export default {
  name: "sittings",
  data() {
   return {}
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
   ...mapMutations(['setRealTime', 'setTimerInterval'])
  }
 }
</script>

<style scoped>
 .sittings-container {
  margin-top: 20px;
 }
</style>