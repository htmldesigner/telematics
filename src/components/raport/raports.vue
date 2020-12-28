<template>
 <div class="raport-container mt-3 px-2">


  <div class="row mb-3">
   <div class="col">
    <div class="raportSelector d-flex align-items-center justify-content-between">
     <label for="raportSelector1">Отчет:</label>
     <v-select
      id="raportSelector1"
      class="w-75"
      :options="reportTypes"
      :reduce="report => report.value"
      label="name"
      v-model="reporttype"
      :clearable="false"
     >
     </v-select>
    </div>
   </div>
  </div>

  <hr>

  <div class="row" v-if="['group_overspeed'].includes(reporttype)">
   <div class="col">
    <div class="custom-control custom-switch">
     Ручное ограничение:
     <input type="checkbox" class="custom-control-input" v-model="customLimit"
            id="customLimitSwitchReport"/>
     <label class="custom-control-label" for="customLimitSwitchReport"></label>
    </div>
   </div>
  </div>

  <div class="row mt-2 mb-0" v-if="['group_overspeed'].includes(reporttype) && customLimit">
   <div class="col">
    <label class="mt-1 mb-0" for="speedLimit">Лимит скорости, км/ч:</label>
    <input type="text" class="form-control form-control-custom" id="speedLimit" v-model="speedLimit"/>
    <label class="mt-1 mb-0" for="speedError">Погрешность, км/ч:</label>
    <input type="text" class="form-control form-control-custom" id="speedError" v-model="overSpeedSens"/>
    <label class="mt-1 mb-0" for="minimumDuration">Минимальная длительность превышения, сек:</label>
    <input type="text" class="form-control form-control-custom" id="minimumDuration" v-model="minOverSpeedDuration"/>
   </div>
  </div>

  <div v-if="['group_geozone', 'group_overspeed', 'track_group', 'track_checkgroup', 'sensor_checkgroup'].includes(reporttype)">
   <div class="row">
    <div class="col">
     <span class="title-custom">Выбрать транспортное средство:</span>
     <div class="multi-selector d-flex align-items-center justify-content-between">
      <TreeTable
       class="treetable-custom-control"
       :value="root"
       sortMode="single"
       selectionMode="checkbox"
       :filters="filters"
       :expandedKeys="expandedKeys"
       filterMode="lenient"
       :selectionKeys.sync="selectedKeys"
       @node-select="onTrackSelect"
       @node-unselect="onTrackUnselect"
      >
       <template>
        <InputText class="mb-3" v-model="filters['name']" placeholder="Введите название, IMEI, регномер"
                   style="width: 100%; height: 35px"/>
       </template>

       <Column field="name" :expander="true" filterMatchMode="contains">
        <template #body="slotProps">
         {{ slotProps.node.data.name }}
        </template>
       </Column>
      </TreeTable>
     </div>
    </div>
   </div>
   <hr>
  </div>

  <div v-if="['group_geozone', 'geozone','geozoneoverspeed','group_overspeed'].includes(reporttype)">
   <div class="row">
    <div class="col">
     <span class="title-custom">Выбрать геозону:</span>
     <div class="multi-selector d-flex align-items-center justify-content-between">

      <TreeTable
       class="treetable-custom-control"
       :value="geoZone"
       sortMode="single"
       selectionMode="checkbox"
       :filters="filtersZone"
       :expandedKeys="expandedKeysZone"
       filterMode="lenient"
       :selectionKeys.sync="selectedKeysZone"
       @node-select="onGeoZoneSelect"
       @node-unselect="onGeoZoneUnselect"
      >
       <template>
        <InputText class="mb-3" v-model="filtersZone['name']" placeholder="Выберете геозону или группу геозон"
                   style="width: 100%; height: 35px"/>
       </template>

       <Column field="name" :expander="true" filterMatchMode="contains">
        <template #body="slotProps">
         {{ slotProps.node.data.name }}
        </template>
       </Column>
      </TreeTable>
     </div>
    </div>
   </div>
   <hr>
  </div>

  <div v-if="['geozoneoverspeed', 'mileagefull', 'mileageshort', 'track_check', 'sensor_check'].includes(reporttype)">
   <div class="row mt-3">
    <div class="col">
     <span class="title-custom">Выбрать транспортное средство:</span>
     <div class="multi-selector d-flex align-items-center justify-content-between">
      <v-select
       style="width: 100%"
       :options="Object.values(this.objects)"
       :reduce="obj => obj.id"
       label="name"
       v-model="selectedObjectId"
       :clearable="false"
      >
      </v-select>

     </div>
    </div>
   </div>
   <hr>
  </div>

  <div class="row">
   <div class="col">
    <span class="title-custom">Отчет за периуд:</span>

    <div class="form-group row">
     <label for="example-datetime-local-input1" class="col-2 col-form-label">От:</label>
     <div class="col-10">
      <input class="form-control form-control-custom" type="datetime-local" v-model="datefrom"
             id="example-datetime-local-input1">
     </div>
    </div>

    <div class="form-group row">
     <label for="example-datetime-local-input2" class="col-2 col-form-label">До:</label>
     <div class="col-10">
      <input class="form-control form-control-custom" type="datetime-local" v-model="dateto"
             id="example-datetime-local-input2">
     </div>
    </div>

   </div>
  </div>
  <div class="row">
   <div class="col d-flex justify-content-end">

    <button
     class="btn-custom mr-2 mt-2"
     @click="loadData"
    >

     <span v-if="loading">Загрузка...</span>
     <span v-else>Выполнить</span>

    </button>

    <button class="btn-custom mt-2" :disabled="true">
     <span>Запланировать</span>
    </button>

   </div>
  </div>

 </div>
</template>

<script>
 import {mapGetters} from "vuex";

 import Treeselect from '@riophae/vue-treeselect'
 import '@riophae/vue-treeselect/dist/vue-treeselect.css'
 import vSelect from 'vue-select'
 import 'vue-select/dist/vue-select.css'
 import moment from 'moment'

 export default {
  components: {
   Treeselect,
   'v-select': vSelect,
  },
  name: "raports",
  computed: {
   ...mapGetters({
    objects: 'getObjects',
    objectsgroups: 'getObjectsGroups',
    geozones: 'getGeozones',
    geozonesgroups: 'getGeozonesGroups',

    getGeoZoneVisitMinDuration: 'getGeoZoneVisitMinDuration',
    getSpeedLimitsValue: 'getSpeedLimitsValue',
    getStopMinDuration: 'getStopMinDuration',
    getOverSpeedMinDuration: 'getOverSpeedMinDuration'
   }),

   root() {
    return this.$service.objectsArrayCreate(this.objectsgroups, this.objects)
   },

   geoZone() {
    return this.$service.objectsArrayCreate(this.geozonesgroups, this.geozones)
   }

  },

  watch: {
   objects() {
    if (Object.keys(this.objects).length > 0) {
     let key = Object.keys(this.objects)[0];
     this.selectedObjectId = this.objects[key].id;
    }
   }
  },

  data() {
   return {
    loading: false,
    reportTypes: [{
     name: "По движению/стоянкам", value: "track_group"
    }, {
     name: "Посещение геозон групповое", value: "group_geozone"
    }, {
     name: "Превышение скорости групповое", value: "group_overspeed"
    }, {
     name: "Превышение скорости в геозонах", value: "geozoneoverspeed"
    },

     {
     name: "По пробегу (полный)", value: "mileagefull"
    }, {
     name: "По пробегу (краткий)", value: "mileageshort"
    },

     {
      name: "Отчет по работе навигационного оборудования", value: "track_check"
     }, {
      name: "Отчет по работе навигационного оборудования (Групповой)", value: "track_checkgroup"
     }, {
      name: "Отчет по дискретным сенсорам", value: "sensor_check"
     }, {
      name: "Отчет по дискретным сенсорам (Групповой)", value: "sensor_checkgroup"
     }
    ],

    filters: {},
    filtersZone: {},

    selectedKeys: null,
    expandedKeys: {},

    selectedKeysZone: null,
    expandedKeysZone: {},

    geoZoneValue: null,

    //Data for query
    reporttype: "track_group",
    customLimit: false,
    speedLimit: 90,
    overSpeedSens: 10,
    minOverSpeedDuration: 60,
    selectedObjectId: '',
    trackId: [],
    geoZoneId: [],

    datefrom: moment().subtract(1, 'd').format("YYYY-MM-DDTHH:mm"),
    dateto: moment().format("YYYY-MM-DDTHH:mm"),

   }
  },
  methods: {
   onTrackSelect(element) {
    let item = element.data
    if (item.objects) {
     this.trackId.push(...item.objects)
     this.trackId = Array.from(new Set(this.trackId))
    } else {
     if (!this.trackId.includes(item.id)) {
      this.trackId.push(item.id)
     } else {
      return false
     }
    }
   },

   onTrackUnselect(element) {
    let item = element.data
    if (item.objects) {
     if (Array.isArray(item.objects)) {
      item.objects.forEach(id => {
       this.trackId = this.trackId.filter(el => {
        return el !== id
       })
      })
     }
    } else {
     if (this.trackId.includes(item.id)) {
      this.trackId = this.trackId.filter(el => el !== item.id)
     }
    }
   },

   onGeoZoneSelect(element) {
    let item = element.data
    if (item.objects) {
     this.geoZoneId.push(...item.objects)
     this.geoZoneId = Array.from(new Set(this.geoZoneId))
    } else {
     if (!this.geoZoneId.includes(item.id)) {
      this.geoZoneId.push(item.id)
     } else {
      return false
     }
    }
   },

   onGeoZoneUnselect(element) {
    let item = element.data
    if (item.objects) {
     if (Array.isArray(item.objects)) {
      item.objects.forEach(id => {
       this.geoZoneId = this.geoZoneId.filter(el => {
        return el !== id
       })
      })
     }
    } else {
     if (this.geoZoneId.includes(item.id)) {
      this.geoZoneId = this.geoZoneId.filter(el => el !== item.id)
     }
    }
   },

   getParam() {
    const id = this.selectedObjectId;
    let reportParam = {
     type: "report",
     report: this.reporttype,
     objectId: id,
     dateFrom: this.datefrom,
     dateTo: this.dateto,

     geozonevisitMinDuration: this.getGeoZoneVisitMinDuration,

     stopMinduration: this.getStopMinDuration,
     speedMinduration: this.getOverSpeedMinDuration,

     parameters: {
      geozones: this.geoZoneId,
      objects: this.trackId.length ? this.trackId : [],
      customLimit: this.customLimit,
      speedLimits: +this.getSpeedLimitsValue[this.getSpeedLimitsValue.length - 1],
      overSpeedSens: +this.overSpeedSens,
      minOverSpeedDuration: +this.minOverSpeedDuration,
     }
    };
    switch (this.reporttype) {
     case "geozone":
      reportParam.speedLimits = this.getSpeedLimitsValue[this.getSpeedLimitsValue.length - 1];
      break;
     case "track":
      reportParam.speedLimits = this.getSpeedLimitsValue[this.getSpeedLimitsValue.length - 1];
      break;
     case "track_group":
      reportParam.speedLimits = this.getSpeedLimitsValue[this.getSpeedLimitsValue.length - 1];
      break;
     case "overspeed":
      reportParam.speedLimits = this.getSpeedLimitsValue[this.getSpeedLimitsValue.length - 1];
      break;
     case "overspeedgrad":
      break;
     case "geozoneoverspeed":
      reportParam.speedLimits = "";
      break;
    }
    return reportParam;
   },

   loadData() {
    let query = [];
    let reportParam = this.getParam();
    query.push(reportParam)
    this.loading = true
    this.$store.dispatch('loadRaport', query).then(response => {
     this.loading = false
    })
   },

  },

 }

</script>

<style scoped>

</style>