<template>
 <div class="tracker-container mt-3 px-2">

  <div class="row">
   <div class="col">
    <div class="objectSelector d-flex align-items-center">
     <label for="objectSelector1">Объект:</label>
     <select v-model="selectedObjectId" class="form-control form-control-custom" id="objectSelector1">
      <option v-for="object of objectsArr" v-bind:value="object.id" :key="object.id">
       {{ object.name }}
      </option>
     </select>
    </div>
   </div>
  </div>
  <div class="row">
   <div class="col">

    <span class="title-custom">Загрузить трек за периуд:</span>

    <div class="form-group row">
     <label for="example-datetime-local-input1" class="col-2 col-form-label">От:</label>
     <div class="col-10">
      <input class="form-control form-control-custom" type="datetime-local" v-model="datefrom"
             id="example-datetime-local-input1">
     </div>
    </div>

    <div class="form-group row">
     <label for="example-datetime-local-input2" class="col-2 col-form-label">До:</label>
     <div class="col-10">
      <input class="form-control form-control-custom" type="datetime-local" v-model="dateto"
             id="example-datetime-local-input2">
     </div>
    </div>

    <button type="button" :disabled="loading" class="btn-custom float-right mt-2" @click="runLoadTracks">
     <span v-if="loading">Загрузка...</span>
     <span v-else>Загрузить треки</span>
    </button>

   </div>
  </div>

  <Traking
   :dateto="dateto"
   :datefrom="datefrom"
   :selected-object-id="selectedObjectId"
   :loadTracks="loadTracks"
   @loadAfterResult="updateValue">
   >
  </Traking>

<!--  <div class="routes mt-5">-->
<!--   <div class="row">-->
<!--    <div class="col p-0 m-0">-->
<!--     <div class="player">-->
<!--      <Player ref="player"/>-->
<!--     </div>-->
<!--    </div>-->
<!--   </div>-->
<!--  </div>-->
 </div>
</template>

<script>
 import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
 import moment from 'moment'
 import Player from "../Player";
 import 'leaflet-polylinedecorator'
 import Traking from "../Traking";

 export default {
  name: "tracker",
  components: {
   Player,
   Traking
  },
  data() {
   return {
    loading: false,
    selectedObjectId: null,
    loadTracks: false
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    objects: 'getObjects',
    timeIntervalStartDate: 'getTimeIntervalStart',
    timeIntervalEndDate: 'getTimeIntervalEnd',
   }),

   objectsArr() {
    this.refreshObjectsInput()
    return this.objects
   },

   datefrom: {
    set(val) {
     this.SETTIMEINTERVALSTART(val);
    },
    get() {
     return this.timeIntervalStartDate
    }
   },

   dateto: {
    set(val) {
     this.SETTIMEINTERVALEND(val);
    },
    get() {
     return this.timeIntervalEndDate
    }
   },

  },
  methods: {
   ...mapMutations(['SETTIMEINTERVALSTART', 'SETTIMEINTERVALEND']),

   runLoadTracks() {
    this.loadTracks = true
    this.loading = true
   },

   updateValue() {
    this.loadTracks = false
    this.loading = false
   },

   refreshObjectsInput() {
    if (Object.keys(this.objects).length > 0) {
     let key = Object.keys(this.objects)[0];
     this.selectedObjectId = this.objects[key].id;
    }
   },

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