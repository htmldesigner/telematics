<template>
 <div class="tracker-container">
  <div class="container">

   <div class="row">
    <div class="col">
     <div class="form-group objectSelector d-flex">
      <label for="objectSelector1">Объект:</label>
      <select v-model="selectedImei" class="form-control" id="objectSelector1">
       <option v-for="object of objects" v-bind:value="object.imei">
        {{ object.name }}
       </option>
      </select>
     </div>
    </div>
   </div>

   <div class="row">
    <div class="col">
     <div class="form-check">
      <input v-model="boolStops" class="form-check-input" type="checkbox" value="" id="boolStops1">
      <label class="form-check-label" for="boolStops1">
       <img src="/img/stops.svg" alt="alt">
      </label>
     </div>

     <div class="form-check">
      <div class="check-container">
       <input v-model="boolOverspeed" class="form-check-input" type="checkbox" value="" id="boolOverspeed1">
       <label class="form-check-label" for="boolOverspeed1">
        <img src="/img/speedings.svg" alt="alt">
       </label>
      </div>
     </div>

     <div class="form-group row">
      <label for="example-datetime-local-input" class="col-2 col-form-label">Начало периода:</label>
      <div class="col-10">
       <input class="form-control" type="datetime-local" value="" v-model="time" id="example-datetime-local-input">
      </div>
     </div>
{{time}}
     <div class="form-group row">
      <label for="example-datetime-local-input" class="col-2 col-form-label">Конец периода:</label>
      <div class="col-10">
       <input class="form-control" type="datetime-local" value="" id="example-datetime-local-input">
      </div>
     </div>

    </div>
   </div>


  </div>
 </div>
</template>

<script>
 import Playback from "../Playback";
 import {mapState, mapGetters} from "vuex";

 export default {
  name: "tracker",
  components: {
   Playback
  },
  data() {
   return {
    time: '',
    selectedImei: "",
    boolOverspeed: true,
    boolStops: true,
   }
  },
  computed: {
   ...mapGetters({
    objects: 'getObjects'
   })
  },
  methods: {
   ...mapState('mapModule', ['mapInstance']),
  },
  mounted() {
   // Load value in select
   if (Object.keys(this.objects).length > 0) {
    let key = Object.keys(this.objects)[0];
    this.selectedImei = this.objects[key].imei;
   }
  }
 }
</script>

<style scoped>
 .tracker-container {
  margin-top: 20px;
 }

 .objectSelector {
  align-items: center;

 }

 .objectSelector label {
  margin: 0 20px 0 0;
  padding: 0;
 }

 .objectSelector select {

 }

</style>