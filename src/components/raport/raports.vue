<template>
 <div class="raport-container  mt-3">
  <div class="container">

   <div class="row mb-3">
    <div class="col">
     <div class="raportSelector d-flex align-items-center justify-content-between">
      <label for="raportSelector1">Отчет:</label>
      <select class="form-control w-75" id="raportSelector1">
       <option v-for="raport of raports">
        {{ raport }}
       </option>
      </select>
     </div>
    </div>
   </div>
   <hr>
   <div class="row">
    <div class="col">
     <h6 class="mb-3 font-weight-bold text-secondary">Выбрать транспортное средство:</h6>
     <div class="multi-selector d-flex align-items-center justify-content-between">
      <div class="">Транспорт:</div>
      <div class="w-75">
       <template>
        <treeselect
         v-model="value1"
         :multiple="true"
         :options="options"
         placeholder="Выберете геозону или группу геозон"
        />
       </template>
      </div>
     </div>
    </div>
   </div>

   <div class="row">
    <div class="col">
     <h6 class="mb-3 mt-3 font-weight-bold text-secondary">Выбрать геозону:</h6>
     <div class="multi-selector d-flex align-items-center justify-content-between">
      <div class="">Геозоны:</div>
      <div class="w-75">
       <template>
        <treeselect
         v-model="value"
         :multiple="true"
         :options="geozone"
         placeholder="Выберете геозону или группу геозон"
        />
       </template>
      </div>
     </div>
    </div>
   </div>

   <hr>

   <div class="row">
    <div class="col">

     <h6 class="mb-3 mt-3 font-weight-bold text-secondary">Отчет за периуд:</h6>

     <div class="form-group row">
      <label for="example-datetime-local-input1" class="col-2 col-form-label">От:</label>
      <div class="col-10">
       <input class="form-control" type="datetime-local" id="example-datetime-local-input1">
      </div>
     </div>

     <div class="form-group row">
      <label for="example-datetime-local-input2" class="col-2 col-form-label">До:</label>
      <div class="col-10">
       <input class="form-control" type="datetime-local" id="example-datetime-local-input2">
      </div>
     </div>

    </div>
   </div>

   <div class="row">
    <div class="col d-flex justify-content-end">
     <button type="button" class="btn-custom-outline mr-3 mt-2">
      <span>Очистить</span>
     </button>

     <button type="button" class="btn-custom mt-2">
      <span>Выполнить</span>
     </button>
    </div>
   </div>

  </div>
 </div>
</template>

<script>
 import {mapGetters} from "vuex";
 import Treeselect from '@riophae/vue-treeselect'
 // import the styles
 import '@riophae/vue-treeselect/dist/vue-treeselect.css'

 export default {
  components: {
   Treeselect
  },
  name: "raports",
  computed: {
   ...mapGetters({
    objects: 'getObjects',
    objectsgroups: 'getObjectsGroups',
   }),
  },
  data() {
   return {
    raports: {
     report_1: 'Отчет по посещению геозон',
     report_2: 'Отчет по превышению скорости в геозоне'
    },
    value1: null,
    value: null,
    options: [{
     id: '12',
     label: 'Группа',
     children: [{
      id: '123',
      label: 'Scaniaу (у309оа)',
     }, {
      id: '123312',
      label: 'УАЗ х212рк56',
     }],
    }, {
     id: '45',
     label: 'Камаз х303ут 56',
    }, {
     id: '54',
     label: 'НИВА х214кр56',
    },
    ],

    geozone: [{
     id: '12',
     label: 'Группа',
     children: [{
      id: '123',
      label: 'Масква',
     }, {
      id: '123312',
      label: 'Самару',
     }],
    }, {
     id: '45',
     label: 'Челябинск',
    },
    ],

   }
  },
  methods: {},
  mounted() {
  }
 }

</script>

<style scoped>

</style>