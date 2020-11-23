<template>
 <div class="v-table-row"
      @click="flyToOverSpeedPoint(over_Speed.id)"
      :id="`${over_Speed_Index + 1}`"
      :class="`overSpeed-${over_Speed_Index + 1}`"

 >

  <div :style="{backgroundColor: over_Speed.properties.color, width: 5+'px', height: 'auto', marginRight: 5+'px'}"></div>
    {{over_Speed_Index + 1}}
  <div class="t_row row__date">{{$moment(over_Speed.properties.startTime).format('MM-DD-YYYY HH:mm')}}</div>
  <div class="t_row row__time">{{$moment.utc($moment(over_Speed.properties.endTime) - $moment(over_Speed.properties.startTime)).format('HH:mm:ss')}}</div>
  <div class="t_row row__address">{{over_Speed.properties.startSpeed}}</div>
  <div class="t_row row__address">{{Math.ceil(over_Speed.properties.distance)}}</div>
  <div class="t_row row__address">{{over_Speed.properties.avgSpeed}}</div>
 </div>
</template>

<script>
 import {mapState} from "vuex";
import moment from 'moment'
 import {eventBus} from "../../eventBus";
 export default {
  name: "raportRow",
  computed: {
   ...mapState('mapModule', ['mapInstance']),
  },
  data() {
   return {}
  },
  props: {
   over_Speed: {
    type: Object,
    default: {}
   },
   over_Speed_Index: {
    type: Number,
    default: null
   }
  },
  methods: {
   flyToOverSpeedPoint(id) {
    let el = document.querySelector('.isActive')
    if (el){
     el.classList.remove('isActive')
    }

    eventBus.$emit('speedSelector', id)

    let elId = document.getElementById(`${id}`)
    if(elId){
     elId.classList.add('isActive')
    }
   }
  },
 }
</script>

<style scoped>
 .v-table-row {
  display: flex;
  justify-content: space-around;
 }

 .v-table-row.isActive{
  background-color: #eee;
 }

 .t_row {
  text-align: center;
  flex-basis: 20%;
  padding: 4px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
 }

 .row__time.overStopDuration {
  color: #ff0000;
 }

 .row__time.notOverStopDuration {
  color: #0044fc;
 }

 .v-table-row:hover {
  background-color: #eee;
 }
</style>