<template>
 <div>
  <div id="pdf"></div>
  <div class="col" v-if="overSpeedRaport">
   <DataTable
    :scrollable="true"
    scrollHeight="500px"
    class="p-datatable-sm"
    ref="testHtml"
    id="my-table"
    :value="overSpeedRaport[0]"
    selectionMode="single"
    dataKey="id"
    @row-select="moveToMarker"

   >
    <Column field="starttime" header="Дата">
     <template #body="slotProps">
      {{ slotProps.data.first.fix_date | moment('YYYY-MM-DD HH:mm:ss') }}
     </template>
    </Column>
    <Column field="duration" header="Скорость">
     <template #body="slotProps">
      {{ slotProps.data.first.speed + ' ' + 'км/ч' }}
     </template>
    </Column>
    <Column header="Превышение">
     <template #body="slotProps">
      {{ (slotProps.data.first.speed - speedLimit).toFixed(1) + ' ' + 'км/ч'}}
     </template>
    </Column>
    <Column header="Продолжительность">
     <template #body="slotProps">
      {{moment(moment(slotProps.data.last.fix_date).diff(moment(slotProps.data.first.fix_date))) | moment('utc', 'HH:mm:ss')}}
     </template>
    </Column>
   </DataTable>
  </div>
 </div>
</template>

<script>
 import {mapGetters, mapState} from "vuex";
 import moment from 'moment'
 import downloadPdfMixin from "../../mixin/downloadPdfMixin";

 export default {
  name: "overspeedRaport",
  mixins: [downloadPdfMixin],
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    overSpeedRaport: 'getOverSpeedRaport',
    speedLimitsValue: 'getSpeedLimitsValue',
   }),
   speedLimit() {
    return this.subtractLimit(this.speedLimitsValue)
   }

  },

  data() {
   return {}
  },

  methods: {
   moveToMarker(item) {
    let marker = item.data.first;
    let lt = marker.lt || marker.latitude;
    let ln = marker.ln || marker.longitude;
    this.mapInstance.flyTo([lt, ln], 14);
   },

   subtractLimit(limitValue) {
    return +limitValue[limitValue.length - 1]
   },

   moment(date) {
    return moment(date);
   },
  },

 }
</script>

<style scoped>

</style>