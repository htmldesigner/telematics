<template>
 <div>
  <div id="pdf"></div>
  <div class="col" v-if="stops">
   <div class="v_table">
    <div class="v_table__header">
     <p>Дата</p>
     <p>Время</p>
     <p>Адрес</p>
    </div>
    <div class="v_table__body">
     <raportRow
     v-for="(stop, index) in stops" :key="index"
     v-bind:stop_row="stop"
     v-bind:stop_index="index"
     />
    </div>
   </div>
  </div>
 </div>
</template>

<script>
 import downloadPdfMixin from "../../mixin/downloadPdfMixin";
 import raportRow from "./raportRow";

 export default {
  name: "stopRaport",
  components: {
   raportRow
  },
  props: {
   stops: {
    type: Array,
    default: null
   }
  },
  mixins: [downloadPdfMixin],
  data() {
   return {}
  }
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
 flex-basis: 33%;
 margin: 0 0 8px 0;
 text-align: center;
}
 /*.v_table__body{*/
 /* height: 700px;*/
 /* overflow-x: scroll!important;*/
 /*}*/
</style>