<template>
 <div class="reportPanel-container">
  <div class="container-fluid">
   <div class="row">
    <div class="col bg-gray report-result">

     <div class="report-result-toolbars d-flex align-items-center justify-content-end py-2">

      <div class="export-pdf mx-2">
       <label for="inputButtonPdf1" class="m-0"><img :src="icon.pdf" alt="Alt"></label>
       <input type="button" id="inputButtonPdf1" class="d-none" @click="run">
      </div>

      <div class="export-exel mx-2">
       <label for="inputButtonExel1" class="m-0"><img :src="icon.exel" alt="Alt"></label>
       <input type="button" id="inputButtonExel1" class="d-none" @click="run">
      </div>

      <div class="export-printer mx-2">
       <label for="inputButtonPrinter1" class="m-0"><img :src="icon.printer" alt="Alt"></label>
       <input type="button" id="inputButtonPrinter1" class="d-none" @click="run">
      </div>

      <div class="clear mx-1">
       <button type="button" class="btn-custom-outline px-2 py-0">
        <span>Очистить</span>
       </button>
      </div>

     </div>

    </div>
   </div>

   <div class="row">

     <table class="table table-hover table-bordered">
      <thead>
      <tr>
       <th scope="col">Дата</th>
       <th scope="col">Транспортное средство</th>
       <th scope="col">Геозона</th>
       <th scope="col">Дата въезда</th>
       <th scope="col">Дата выезда</th>
      </tr>
      </thead>
      <tbody>
      <tr>
       <th scope="row">{{ new Date() | moment('YYYY-MM-DD') }}</th>
       <td>	Scaniaу (у309оа)</td>
       <td>Масква</td>
       <td>{{ new Date() | moment('YYYY-MM-DD hh:mm') }}</td>
       <td>{{ new Date() | moment("add", "7 days", 'YYYY-MM-DD hh:mm') }}</td>

      </tr>
      <tr>
       <th scope="row">{{ new Date() | moment('YYYY-MM-DD') }}</th>
       <td>	УАЗ х212рк56</td>
       <td>Самара</td>
       <td>{{ new Date() | moment("add", "12 days",'YYYY-MM-DD hh:mm') }}</td>
       <td>{{ new Date() | moment("add", "40 days", 'YYYY-MM-DD hh:mm') }}</td>
      </tr>
      <tr>
       <th scope="row">{{ new Date() | moment('YYYY-MM-DD') }}</th>
       <td>Камаз х303ут 56</td>
       <td>Челябинск</td>
       <td>{{ new Date() | moment("add", "1 days",'YYYY-MM-DD hh:mm') }}</td>
       <td>{{ new Date() | moment("add", "12 days", 'YYYY-MM-DD hh:mm') }}</td>
      </tr>
      </tbody>
     </table>

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
     pdf: '/img/pdf_icon.svg',
     exel: '/img/excel-file.svg',
     printer: '/img/printer.svg',
    }
   }
  },
  methods: {
   run() {
    console.log('fdf')
   }
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