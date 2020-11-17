<template>
 <div>
  <div id="pdf"></div>
  <div class="col" v-if="overSpeeds">
   <div class="v_table">
    <div class="v_table__header">
     <p>Дата</p>
     <p>Продолжительность</p>
     <p>Скорость км/ч</p>
     <p>Расстояние, м</p>
     <p>Средняя скорость км/ч</p>
    </div>
    <div class="v_table__body">
     <overSpeedRow
      v-for="(overSpeed, index) in overSpeeds" :key="index"
      v-bind:over_Speed="overSpeed"
      v-bind:over_Speed_Index="index"
     />
    </div>
   </div>
  </div>
 </div>
</template>

<script>
 import {mapGetters, mapState} from "vuex";
 import moment from 'moment'
 import downloadPdfMixin from "../../mixin/downloadPdfMixin";
import overSpeedRow from "./overSpeedRow";
 export default {
  name: "overspeedRaport",
  components: {
   overSpeedRow
  },
  mixins: [downloadPdfMixin],
  computed: {
   ...mapState('mapModule', ['mapInstance']),
  },
  props: {
   overSpeeds: {
    type: Array,
    default: null
   }
  },
  data() {
   return {}
  },

 }
</script>

<style scoped>

 .v_table{
  width: auto;
  margin: 0 auto;
 }

 .v_table__header{
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #dcdcdc;
 }
 .v_table__header p {
  flex-basis: 20%;
  margin: 0 0 8px 0;
  text-align: center;
 }

</style>