<template>
 <div class="tracker-container mt-3">
  <div class="container">

   <div class="row mb-3">
    <div class="col">
     <div class="objectSelector d-flex align-items-center">
      <label for="objectSelector1">Объект:</label>
      <select v-model="selectedObjectId" class="form-control" id="objectSelector1">
       <option v-for="object of objects" v-bind:value="object.id">
        {{ object.name }}
       </option>
      </select>
     </div>
    </div>
   </div>

   <div class="row">
    <div class="col">

     <h6 class="mb-3 mt-3 font-weight-bold text-secondary">Загрузить трек за периуд:</h6>

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

     <button type="button" :disabled="loading" class="btn-custom float-right w-50 mt-2" @click="loadTracks">
      <span v-if="loading">Загрузка...</span>
      <span v-else>Загрузить треки</span>
     </button>

    </div>
   </div>

   <div class="routes mt-5">
    <div class="row">
     <div class="col p-0 m-0">

      <div class="player">
       <Player/>
      </div>

     </div>
    </div>
   </div>


  </div>
 </div>
</template>

<script>
 import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
 import moment from 'moment'
 import Player from "../Player";

 export default {
  name: "tracker",
  components: {
   Player,
  },
  data() {
   return {
    trackLayers: [],
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
     playButton: '/img/play.svg',
     pauseButton: '/img/pause.svg',
     remove: '/img/remove.svg'
    },
    play: false,
    loading: null,
    selectedObjectId: "",
    boolOverspeed: true,
    boolStops: true,

    timeIntervalStart: '02.02.2020 18:00',
    timeIntervalEnd: '03.02.2020 18:02',

   }
  },
  computed: {
   ...mapGetters({
    objects: 'getObjects',
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


   loadTracks() {
    this.loading = true
    const id = this.selectedObjectId;
    let query = [];
    let startTime = this.timeIntervalStart; // moment(this.timeIntervalStart).format('DD.MM.yyyy, HH:mm');
    let endTime = this.timeIntervalEnd; // moment(this.timeIntervalEnd).format('DD.MM.yyyy, HH:mm');


    query.push(
     {
      type: "track",
      objectId: id,
      dateFrom: startTime,
      dateTo: endTime
     });
    if (this.boolStops)
     query.push(
      {
       type: "stop",
       objectId: id,
       dateFrom: startTime,
       dateTo: endTime
      });
    if (this.boolOverspeed)
     query.push(
      {
       type: "overspeed",
       objectId: id,
       dateFrom: startTime,
       dateTo: endTime,
       speedLimits: '0, 10, 20, 30'
      });

    this.$store.dispatch('loadTracks',
     {
      query: query,
      id: this.selectedObjectId
     }).then(() => {
     this.loading = false
    })
   },
  },
  mounted() {
   // Load value in select
   if (Object.keys(this.objects).length > 0) {
    let key = Object.keys(this.objects)[0];
    this.selectedObjectId = this.objects[key].id;
   }

  },
  created() {

  }

 }
</script>

<style scoped>
 .objectSelector label {
  margin: 0 20px 0 0;
  padding: 0;
 }

 .tracker-result {
  border-bottom: 1px solid #c2c2c2;
  margin-bottom: 10px;

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