<template>
 <div class="v-table-row"
      @click="flyToStopPoint(stop_row.latitude, stop_row.longitude, stop_index + 1)"
      :id="`${stop_index + 1}`"
      :class="`stop-${stop_index + 1}`"
 >
  <div style="margin-right: 5px;" :class="{'overStopDuration': stop_row.duration > 300, 'notOverStopDuration': stop_row.duration < 300,}"></div>
  {{stop_index + 1}}
  <div class="t_row row__date">{{$moment.utc(stop_row.starttime).format('YYYY-MM-DD HH:mm:ss')}}</div>
  <div class="t_row row__time">
   {{$moment.utc(stop_row.duration * 1000).format('HH:mm:ss') }}
  </div>
  <div class="t_row row__address">{{stop_row.address}}</div>
 </div>
</template>

<script>
 import {mapState} from "vuex";

 export default {
  name: "raportRow",
  computed: {
   ...mapState('mapModule', ['mapInstance']),
  },
  props: {
   stop_row: {
    type: Object,
    default: {}
   },
   stop_index: {
    type: Number,
    default: null
   }
  },
  methods: {
   flyToStopPoint(latitude, longitude, id) {
    let el = document.querySelector('.isActive')
    if (el) {
     el.classList.remove('isActive')
    }

    this.mapInstance.flyTo([latitude, longitude], 12)

    let elId = document.getElementById(`${id}`)
    if (elId) {
     elId.classList.add('isActive')
    }
   }
  },
  mounted() {
   this.moment
  }
 }
</script>

<style scoped>
 .v-table-row {
  display: flex;
  justify-content: space-around;
 }

 .t_row {
  text-align: center;
  flex-basis: 33%;
  padding: 4px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
 }

.overStopDuration {
  background-color: red;
  width: 5px;
  height: auto;
 }

 .v-table-row.isActive{
  background-color: #eee;
 }

.notOverStopDuration {
  background-color: #0044fc;
  width: 5px;
 height: auto;
 }

 .v-table-row:hover {
  background-color: #eee;
 }
</style>