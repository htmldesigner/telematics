<template>
 <div>
  <div id="pdf"></div>
  <div class="col" v-if="stopRaport">
   <DataTable
    :scrollable="true"
    scrollHeight="500px"
    class="p-datatable-sm"
    :value="stopRaport[0]"
    ref="testHtml"
    id="my-table"
    selectionMode="single"
    dataKey="id"
    @row-select="moveToMarker"
   >
    <Column field="starttime" header="Дата">
     <template #body="slotProps">
      {{ (slotProps.data.starttime) | moment('YYYY-MM-DD HH:mm:ss') }}
     </template>
    </Column>
    <Column field="duration" header="Продолжительность">
     <template #body="slotProps">
      {{ (slotProps.data.duration) | moment('utc', 'HH:mm:ss') }}
     </template>
    </Column>
    <Column field="endtime" header="Окончание остановки">
     <template #body="slotProps">
      {{ (slotProps.data.endtime) | moment('YYYY-MM-DD HH:mm:ss') }}
     </template>
    </Column>
    <Column field="address" header="Адрес">
     <template #body="slotProps">
      {{slotProps.data.latitude}},
      {{slotProps.data.longitude}}
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
  name: "stopRaport",
  components: {},
  mixins: [downloadPdfMixin],
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    stopRaport: 'getStopRaport',
   }),
  },
  data() {
   return {}
  },
  methods: {
   moveToMarker(item) {
    let marker = item.data;
    let lt = marker.lt || marker.latitude;
    let ln = marker.ln || marker.longitude;
    this.mapInstance.flyTo([lt,ln], 14);
   },

   moment(date) {
    return moment(date);
   },

  },

 }
</script>

<style scoped>

</style>