<template>
 <div class="reportPanel-container">
  <div class="container-fluid">
   <div class="row">
    <div class="col">

     <div class="report-result-toolbars d-flex align-items-center justify-content-end pt-1">

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
       <button type="button" class="btn-custom-outline" @click="clearAllRaport">
        <span>Очистить</span>
       </button>
      </div>

     </div>

    </div>
   </div>

   <div class="row">
    <TabNav
     class="ml-1"
     :tabs="tabName"
     :selected="selected"
     @selected="setSelected"
     @tab-close="tabClose"
    >
     <Tab :isSelected="selected === 'По движению/стоянкам'">
      <slot>
       <div class="v_tab_table">
        <div v-for="(tracks) in getTrackGroup">

         <div class="download-links" v-if="tracks.linkpdf">
          <a download :href="tracks.link" title="Скачать отчет"><img :src="icon.exel" alt="Alt"></a>
          <a download :href="tracks.linkpdf" title="Скачать отчет"><img :src="icon.pdf" alt="Alt"></a>
         </div>

         <div v-for="(track, idx) in tracks.data" :key="idx">
          <p class="v_tab_table_name">{{idx}}</p>

          <div v-if="track.length" class="v_tab_table__header mr-2">
           <p>Действие</p>
           <p>Дата начала</p>
           <p>Дата конца</p>
           <p>Длительность</p>
           <div class="v_tab_table__header__combine">
            <p>Растояние, км</p>
            <p>Средняя скорость</p>
            <p>Адрес</p>
           </div>
          </div>
          <div v-else>
           <p class="v_tab_table__header__empty">Данные за период отсутствуют</p>
          </div>
          <div class="v_tab_table__body mr-2">
           <div class="v_tab_table__body__row" v-for="(trackElement) in track">
            <div class="v_tab__row">{{trackElement.action}}</div>
            <div class="v_tab__row">{{trackElement.starttime}}</div>
            <div class="v_tab__row">{{trackElement.endtime}}</div>
            <div class="v_tab__row">{{trackElement.duration}}</div>
            <div class="v_tab__row" v-if="trackElement.action === 'Стоянка'">{{trackElement.address}}</div>
            <div class="v_tab__row distance_speed" v-else><span>{{trackElement.distance}}</span> <span>{{trackElement.speed}} км/ч</span>
            </div>
           </div>
          </div>
         </div>

        </div>
       </div>
      </slot>
     </Tab>

     <Tab :isSelected="selected === 'Посещение геозон групповое'">
      <slot>
       <div class="v_tab_table mr-2">
        <div v-for="(tracks) in getGroupGeoZone">

         <div class="download-links" v-if="tracks.linkpdf">
          <a download :href="tracks.link"><img :src="icon.exel" alt="Alt"></a>
          <a download :href="tracks.linkpdf"><img :src="icon.pdf" alt="Alt"></a>
         </div>

         <table class="table table-hover table-sm">
          <thead>
          <tr>
           <th class="text-center th-font">Геозона</th>
           <th class="text-center th-font">№ посещения геозоны</th>
           <th class="text-center th-font">Объект</th>
           <th class="text-center th-font">№ посещения объектом</th>
           <th class="text-center th-font">Время входа</th>
           <th class="text-center th-font">Время выхода</th>
           <th class="text-center th-font">Время в зоне</th>
           <th class="text-center th-font">Пробег в зоне, м</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(track) in tracks.data" :key="track.id">
           <td class="text-center">{{track.geozone}}</td>
           <td class="text-center">{{track.nGeo}}</td>
           <td class="text-center">{{track.object}}</td>
           <td class="text-center">{{track.nObject}}</td>
           <td class="text-center">{{track.enterTime}}</td>
           <td class="text-center">{{track.exitTime}}</td>
           <td class="text-center">{{track.geozoneTime}}</td>
           <td class="text-center">{{track.geozoneDistance}}</td>
          </tr>
          </tbody>
         </table>

        </div>
       </div>
      </slot>
     </Tab>

     <Tab :isSelected="selected === 'Превышение скорости групповое'">
      <slot>
       <div class="v_tab_table mr-2">
        <div v-for="(tracks) in getGroupOverSpeed">

         <div class="download-links" v-if="tracks.linkpdf">
          <a download :href="tracks.link"><img :src="icon.exel" alt="Alt"></a>
          <a download :href="tracks.linkpdf"><img :src="icon.pdf" alt="Alt"></a>
         </div>

         <p class="v_tab_table_name">{{tracks.name}}</p>


         <table class="table table-hover table-sm">
          <thead>
          <tr>
           <th class="text-center th-font">Дата начала</th>
           <th class="text-center th-font">Дата конца</th>
           <th class="text-center th-font">Максимальная скорость</th>
           <th class="text-center th-font">Ограничение скорости</th>
           <th class="text-center th-font">Место ограничения</th>
           <th class="text-center th-font">Длительность</th>
           <th class="text-center th-font">Расстояние, м</th>
           <th class="text-center th-font">Место максисума</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(track) in tracks.data" :key="track.id">
           <td class="text-center">{{track.starttime}}</td>
           <td class="text-center">{{track.endtime}}</td>
           <td class="text-center">{{track.maxSpeed}}</td>
           <td class="text-center">{{track.speedLimit}}</td>
           <td class="text-center">{{track.whereLimit}}</td>
           <td class="text-center">{{track.duration}}</td>
           <td class="text-center">{{track.distance}}</td>
           <td class="text-center">{{track.whereMax}}</td>
          </tr>
          </tbody>
         </table>

         <!--          <div class="v_tab_table__header mr-2">-->
         <!--           <p>Дата начала</p>-->
         <!--           <p>Дата конца</p>-->
         <!--           <p>Максимальная скорость</p>-->
         <!--           <p>Ограничение скорости</p>-->
         <!--           <p>Место ограничения</p>-->
         <!--           <p>Длительность</p>-->
         <!--           <p>Расстояние, м</p>-->
         <!--           <p>Место максисума</p>-->
         <!--          </div>-->

         <!--          <div class="v_tab_table__body mr-2">-->
         <!--           <div class="v_tab_table__body__row"  v-for="(track, idx) in tracks.data" :key="track.id">-->
         <!--            <div class="v_tab__row">{{track.starttime}}</div>-->
         <!--            <div class="v_tab__row">{{track.endtime}}</div>-->
         <!--            <div class="v_tab__row">{{track.maxSpeed}}</div>-->
         <!--            <div class="v_tab__row">{{track.speedLimit}}</div>-->
         <!--            <div class="v_tab__row">{{track.whereLimit}}</div>-->
         <!--            <div class="v_tab__row">{{track.duration}}</div>-->
         <!--            <div class="v_tab__row">{{track.distance}}</div>-->
         <!--            <div class="v_tab__row">{{track.whereMax}}</div>-->
         <!--            </div>-->
         <!--           </div>-->

        </div>
       </div>
      </slot>
     </Tab>

     <Tab :isSelected="selected === 'Превышение скорости в геозонах'">
      <slot>
       <div class="v_tab_table mr-2">
        <div v-for="(tracks) in getGeoZoneOverSpeed">

         <div class="download-links" v-if="tracks.linkpdf">
          <a download :href="tracks.link"><img :src="icon.exel" alt="Alt"></a>
          <a download :href="tracks.linkpdf"><img :src="icon.pdf" alt="Alt"></a>
         </div>

         <p class="v_tab_table_name">{{tracks.name}}</p>

         <table class="table table-hover table-sm">
          <thead>
          <tr>
           <th class="text-center th-font">Дата начала</th>
           <th class="text-center th-font">Дата конца</th>
           <th class="text-center th-font">Максимальная скорость</th>
           <th class="text-center th-font">Ограничение скорости</th>
           <th class="text-center th-font">Место ограничения</th>
           <th class="text-center th-font">Длительность</th>
           <th class="text-center th-font">Расстояние, м</th>
           <th class="text-center th-font">Место максисума</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(track) in tracks.data" :key="track.id">
           <td class="text-center">{{track.starttime}}</td>
           <td class="text-center">{{track.endtime}}</td>
           <td class="text-center">{{track.maxSpeed}}</td>
           <td class="text-center">{{track.speedLimit}}</td>
           <td class="text-center">{{track.whereLimit}}</td>
           <td class="text-center">{{track.duration}}</td>
           <td class="text-center">{{track.distance}}</td>
           <td class="text-center">{{track.whereMax}}</td>
          </tr>
          </tbody>
         </table>

         <!--          <div class="v_tab_table__header mr-2">-->
         <!--           <p>Дата начала</p>-->
         <!--           <p>Дата конца</p>-->
         <!--           <p>Максимальная скорость</p>-->
         <!--           <p>Ограничение скорости</p>-->
         <!--           <p>Место ограничения</p>-->
         <!--           <p>Длительность</p>-->
         <!--           <p>Расстояние, м</p>-->
         <!--           <p>Место максисума</p>-->
         <!--          </div>-->

         <!--          <div class="v_tab_table__body mr-2">-->
         <!--           <div class="v_tab_table__body__row"  v-for="(track, idx) in tracks.data" :key="track.id">-->
         <!--            <div class="v_tab__row">{{track.starttime}}</div>-->
         <!--            <div class="v_tab__row">{{track.endtime}}</div>-->
         <!--            <div class="v_tab__row">{{track.maxSpeed}}</div>-->
         <!--            <div class="v_tab__row">{{track.speedLimit}}</div>-->
         <!--            <div class="v_tab__row">{{track.whereLimit}}</div>-->
         <!--            <div class="v_tab__row">{{track.duration}}</div>-->
         <!--            <div class="v_tab__row">{{track.distance}}</div>-->
         <!--            <div class="v_tab__row">{{track.whereMax}}</div>-->
         <!--            </div>-->
         <!--           </div>-->

        </div>
       </div>
      </slot>
     </Tab>
    </TabNav>

   </div>

  </div>
 </div>
</template>

<script>
 import moment from 'moment'
 import {mapGetters} from "vuex";
 import TabNav from "./TabNav";
 import Tab from "./Tab";

 export default {
  name: "raportPanel",
  components: {
   TabNav,
   Tab
  },
  data() {
   return {
    selected: null,
    activeTab: null,
    icon: {
     pdf: require('@/assets/pdf_icon.svg'),
     exel: require('@/assets/excel-file.svg'),
     printer: require('@/assets/printer.svg'),
    }
   }
  },
  computed: {
   ...mapGetters({
    getTrackGroup: 'getTrackGroup',
    getGroupGeoZone: 'getGroupGeoZone',
    getGroupOverSpeed: 'getGroupOverSpeed',
    getGeoZoneOverSpeed: 'getGeoZoneOverSpeed'
   }),
   tabName() {
    let prepareTabList = []
    if (this.getTrackGroup?.length) {
     prepareTabList.push({alias: 'trackGroup', tab: 'По движению/стоянкам'})
     // this.selected = 'По движению/стоянкам'
    }

    if (this.getGroupGeoZone?.length) {
     prepareTabList.push({alias: 'groupGeoZone', tab: 'Посещение геозон групповое'})
     // this.selected = 'Посещение геозон групповое'
    }

    if (this.getGroupOverSpeed?.length) {
     prepareTabList.push({alias: 'groupOverSpeed', tab: 'Превышение скорости групповое'})
     // this.selected = 'Превышение скорости групповое'
    }

    if (this.getGeoZoneOverSpeed?.length) {
     prepareTabList.push({alias: 'geoZoneOverSpeed', tab: 'Превышение скорости в геозонах'})
     // this.selected = 'Превышение скорости в геозонах'
    }
    return prepareTabList
   }
  },

  watch: {

   getTrackGroup: {
    handler(newValue, oldValue) {
     if (newValue) {
      setTimeout(() => {
       this.selected = 'По движению/стоянкам'
      }, 100)
     } else {
      this.selected = this.tabName[0].tab
     }
    },
    immediate: true,
    deep: true
   },

   getGroupGeoZone: {
    handler(newValue, oldValue) {
     if (newValue) {
      setTimeout(() => {
       this.selected = 'Посещение геозон групповое'
      }, 100)
     } else {
      this.selected = this.tabName[0].tab
     }
    },
    immediate: true,
    deep: true
   },

   getGroupOverSpeed: {
    handler(newValue, oldValue) {
     if (newValue) {
      setTimeout(() => {
       this.selected = 'Превышение скорости групповое'
      }, 100)
     } else {
      this.selected = this.tabName[0].tab
     }
    },
    immediate: true,
    deep: true
   },
   getGeoZoneOverSpeed: {
    handler(newValue, oldValue) {
     if (newValue) {
      setTimeout(() => {
       this.selected = 'Превышение скорости в геозонах'
      }, 100)
     } else {
      this.selected = this.tabName[0].tab
     }
    },
    immediate: true,
    deep: true
   }
  },
  methods: {
   setSelected(tab) {
    this.selected = tab
   },

   tabClose(tab) {
    switch (tab) {
     case 'trackGroup':
      this.$store.state.raport.trackGroup = null
      this.tabName.filter(el => {
       return el.alias !== 'trackGroup'
      })
      break;
     case 'groupGeoZone':
      this.$store.state.raport.groupGeoZone = null
      this.tabName.filter(el => {
       return el.alias !== 'groupGeoZone'
      })
      break;
     case 'groupOverSpeed':
      this.$store.state.raport.groupOverSpeed = null
      this.tabName.filter(el => {
       return el.alias !== 'groupOverSpeed'
      })
      break;
     case 'geoZoneOverSpeed':
      this.$store.state.raport.geoZoneOverSpeed = null
      this.tabName.filter(el => {
       return el.alias !== 'geoZoneOverSpeed'
      })
      break;
    }
   },

   clearAllRaport() {
    this.$store.dispatch('clearAllRaport')
   }
  }
 }
</script>

<style scoped>

</style>