<template>
 <div class="tracker-container">
  <div class="container">

   <div class="row mb-3">
    <div class="col">
     <div class="objectSelector d-flex">
      <label for="objectSelector1">Объект:</label>
      <select v-model="selectedImei" class="form-control" id="objectSelector1">
       <option v-for="object of objects" v-bind:value="object.imei">
        {{ object.name }}
       </option>
      </select>
     </div>
    </div>
   </div>

   <div class="track-control mb-3">
    <div class="row">
     <div class="col d-flex justify-content-end">

      <div class="tracker-stop-selector mx-1" title="Остановки">
       <input v-model="boolStops" class="form-check-input d-none" type="checkbox" value="" id="boolStops1">
       <label class="form-check-label" for="boolStops1">
        <img v-if="boolStops" :src="icon.stop" alt="alt">
        <img v-else :src="icon.stop_off" alt="alt">
       </label>
      </div>

      <div class="tracker-speed-selector mx-1" title="Привышения">
       <input v-model="boolOverspeed" class="form-check-input d-none" type="checkbox" value="" id="boolOverspeed1">
       <label class="form-check-label" for="boolOverspeed1">
        <img v-if="boolOverspeed" :src="icon.speed" alt="alt">
        <img v-else :src="icon.speed_off" alt="alt">
       </label>
      </div>

      <div class="tracker-parking-selector mx-1" title="Парковки">
       <input v-model="boolParking" class="form-check-input d-none" type="checkbox" value="" id="boolParking1">
       <label class="form-check-label" for="boolParking1">
        <img v-if="boolParking" :src="icon.parking" alt="alt">
        <img v-else :src="icon.parking_off" alt="alt">
       </label>
      </div>

      <div class="tracker-fillings-selector mx-1" title="Парковки">
       <input v-model="boolFilling" class="form-check-input d-none" type="checkbox" value="" id="boolFilling1">
       <label class="form-check-label" for="boolFilling1">
        <img v-if="boolFilling" :src="icon.filling" alt="alt">
        <img v-else :src="icon.filling_off" alt="alt">
       </label>
      </div>

     </div>
    </div>
   </div>


   <div class="row">
    <div class="col">

     <h6 class="mb-3 font-weight-bold text-secondary">Загрузить трек за периуд:</h6>

     <div class="form-group row">
      <label for="example-datetime-local-input1" class="col-2 col-form-label">От:</label>
      <div class="col-10">
       <input class="form-control" type="datetime-local" v-model="datefrom" id="example-datetime-local-input1">
      </div>
     </div>

     <div class="form-group row">
      <label for="example-datetime-local-input2" class="col-2 col-form-label">До:</label>
      <div class="col-10">
       <input class="form-control" type="datetime-local" v-model="dateto" id="example-datetime-local-input2">
      </div>
     </div>

     <button type="button" :disabled="loading" class="btn-custom float-right mt-2" @click="loadTracks">
      <span v-if="loading">Загрузка...</span>
      <span v-else>Загрузить треки</span>
     </button>

    </div>
   </div>

   <div class="routes mt-5">
    <div class="row">
     <div class="col p-0 m-0">
      <ul class="routes-list">

       <li v-for="(track, index) in tracks" :key="index">
        <div class="routes-target d-flex justify-content-between"><p>{{track.obj.name}}</p>
         <div class="route-navigation-panel d-flex mr-3 align-items-center">

          <div class="route-play mx-2">
           <img :src="icon.play" alt="Alt">
          </div>

          <div class="route-remove mx-2">
           <img :src="icon.remove" alt="Alt">
          </div>

         </div>
        </div>
       </li>
      </ul>

     </div>
    </div>
   </div>


  </div>
 </div>
</template>

<script>
 import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
 import moment from 'moment'

 export default {
  name: "tracker",
  components: {},
  data() {
   return {
    time: null,
    icon: {
     stop: '/img/stops.svg',
     stop_off: '/img/stops-off.svg',
     speed: '/img/speedings.svg',
     speed_off: '/img/speedings-off.svg',
     parking: '/img/parkings.svg',
     parking_off: '/img/parkings-off.svg',
     filling: '/img/fillings.svg',
     filling_off: '/img/fillings-off.svg',
     play: '/img/play.svg',
     remove: '/img/remove.svg'
    },
    loading: null,
    selectedImei: "",
    boolOverspeed: true,
    boolStops: true,
    boolParking: true,
    boolFilling: true,
   }
  },
  computed: {
   ...mapGetters({
    objects: 'getObjects',
    tracks: 'getTracks',
    timeIntervalStartDate: 'getTimeIntervalStart',
    timeIntervalEndDate: 'getTimeIntervalEnd',
   }),
   datefrom: {
    set(val) {
     this.setTimeIntervalStart(val);
    },
    get() {
     return this.timeIntervalStartDate
    }
   },
   dateto: {
    set(val) {
     this.setTimeIntervalEnd(val);
    },
    get() {
     return this.timeIntervalEndDate
    }
   },
  },
  methods: {
   ...mapMutations(['setTimeIntervalStart', 'setTimeIntervalEnd']),
   ...mapState('mapModule', ['mapInstance']),
   ...mapActions(['loadTracksFor']),
   async  loadTracks() {
    this.loading = true

    let params = {
     ids: this.selectedImei,
     dateFrom: moment(this.timeIntervalStartDate).format('DD.MM.YYYY, hh:mm:ss'),
     dateTo: moment(this.timeIntervalEndDate).format('DD.MM.YYYY, hh:mm:ss'),
     speedLimit: '0,11,20, 40'
    }

   await this.loadTracksFor(params).then(() => {
     this.loading = false
    })
   }
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

 .routes-target {
  background-color: #f5f5f5;
  padding: 10px;
  margin: 0 0 1px 0;
 }

 .routes-target p {
  padding: 0;
  margin: 0;
  font-size: 14px;
 }

</style>