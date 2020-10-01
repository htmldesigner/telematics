<template>
 <div>
  <div id="pdf"></div>
  <div class="col pr-3 pl-2" v-if="allTrack">
   <DataTable ref="testHtml"
              id="my-table"
              :scrollable="true"
              scrollHeight="500px"
              class="p-datatable-sm"
              :value="info"
              selectionMode="single"
              dataKey="id"

   >
    <Column field="name" header="ТС">
     <template #body="slotProps">
      {{slotProps.data.name}}
     </template>
    </Column>
    <Column field="reg_number" header="ГОС. номер">
     <template #body="slotProps">
      {{slotProps.data.reg_number}}
     </template>
    </Column>
    <Column field="startPoint" header="Старт">
     <template #body="slotProps">
      {{slotProps.data.startPoint}}
     </template>
    </Column>
    <Column field="finishPoint" header="Финиш">
     <template #body="slotProps">
      {{slotProps.data.finishPoint}}
     </template>
    </Column>
    <Column field="startTime" header="Время старта">
     <template #body="slotProps">
      {{slotProps.data.startTime}}
     </template>
    </Column>
    <Column field="finishTime" header="Время финиша">
     <template #body="slotProps">
      {{slotProps.data.finishTime}}
     </template>
    </Column>
    <Column field="mSpeed" header="Средняя скорость">
     <template #body="slotProps">
      {{slotProps.data.mSpeed + ' ' + 'км/ч'}}
     </template>
    </Column>
    <Column field="timeOnRoad" header="Время в пути">
     <template #body="slotProps">
      {{slotProps.data.timeOnRoad}}
     </template>
    </Column>
   </DataTable>
  </div>
 </div>
</template>

<script>
 import {mapGetters, mapState} from "vuex";
 import moment from 'moment'
 import jsPDF from "jspdf";
 import html2canvas from 'html2canvas'
 import downloadPdfMixin from "../../mixin/downloadPdfMixin";

 export default {
  name: "allTrack",
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    allTrack: 'getAllTrackRaport',
   }),
   info() {
    return this.run()
   }
  },
  mixins: [downloadPdfMixin],
  data() {
   return {
    trackInfo: []
   }
  },
  methods: {
   run() {
    let forindex = 0;

    let sResult = this.allTrack.track

    let distance_summ = 0;
    let speed_summ = 0;

    let length = sResult.data.length;

    let name = sResult.name
    let reg_number = sResult.reg_number
    let distance = 0
    let startPoint = [sResult.data[0][0], sResult.data[0][1]]
    let finishPoint = [sResult.data[length - 1][0], sResult.data[length - 1][1]]
    let startTime = moment(sResult.data[0][3]).format('YYYY-MM-DD HH:mm:ss')
    let finishTime = moment(sResult.data[length - 1][3]).format('YYYY-MM-DD HH:mm:ss')
    let middleSpeed = []
    let timeOnRoad = moment.utc(moment(finishTime).diff(moment(startTime))).format("HH:mm:ss")


    while (length > forindex) {
     let [lt, ln, speed, fix_date, course, distance, geozones_id] = sResult.data[forindex];
     distance_summ += distance;

     if (speed > 40) {
      middleSpeed.push(speed)
     }

     distance = Number(distance_summ / 1000).toFixed(2);
     forindex++
    }

    let mSpeed = Number(this.average(middleSpeed).toFixed(1))

    this.pdf = [name, reg_number, startPoint, finishPoint, startTime, finishTime, mSpeed, timeOnRoad]

    return [{name, reg_number, startPoint, finishPoint, startTime, finishTime, mSpeed, timeOnRoad}]

   },

   average(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
   },

  }
 }
</script>

<style scoped>

</style>