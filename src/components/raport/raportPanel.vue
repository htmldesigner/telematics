<template>
 <div class="reportPanel-container">
  <div class="container-fluid">
   <div class="row">
    <div class="col">

     <div class="report-result-toolbars d-flex align-items-center justify-content-end py-2">

<!--      <div class="export-pdf mx-2">-->
<!--       <label for="inputButtonPdf1" class="m-0"><img :src="icon.pdf" alt="Alt"></label>-->
<!--       <input type="button" id="inputButtonPdf1" class="d-none" @click="run">-->
<!--      </div>-->

<!--      <div class="export-exel mx-2">-->
<!--       <label for="inputButtonExel1" class="m-0"><img :src="icon.exel" alt="Alt"></label>-->
<!--       <input type="button" id="inputButtonExel1" class="d-none" @click="run">-->
<!--      </div>-->

<!--      <div class="export-printer mx-2">-->
<!--       <label for="inputButtonPrinter1" class="m-0"><img :src="icon.printer" alt="Alt"></label>-->
<!--       <input type="button" id="inputButtonPrinter1" class="d-none" @click="run">-->
<!--      </div>-->

      <div class="clear mx-1">
       <button type="button" class="btn-custom-outline px-2 py-0">
        <span>Очистить</span>
       </button>
      </div>

     </div>

    </div>
   </div>

   <div class="row">
 <ul>
  <li>Дата</li>
  <li>Транспортное средство</li>
  <li>Геозона</li>
  <li>Дата въезда</li>
  <li>Дата выезда</li>
 </ul>

   </div>

  </div>
 </div>
</template>

<script>
 import moment from 'moment'
 export default {
  name: "raportPanel",
  data() {
   return {
    icon: {
     pdf: require('@/assets/pdf_icon.svg'),
     exel: require('@/assets/excel-file.svg'),
     printer: require('@/assets/printer.svg'),
    }
   }
  },
  methods: {
   run() {
    console.log('fdf')
   }
  },
  created() {
   console.log('erer')
  }
 }
</script>

<style scoped>
.report-result{
 border-bottom: 1px solid #d4d4d4;
 border-top: 1px solid #d4d4d4;
}
table thead {
 background-color: #efefef;
}
.table-bordered th{
 font-weight: normal;
}
</style>