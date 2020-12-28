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







     
     <Tab :isSelected="selected === 'Отчет по работе навигационного оборудования'">
      <slot>
       <div class="v_tab_table mr-2">
        <div v-for="(trackchecks) in getTrackCheck">

         <div class="download-links" v-if="trackchecks.linkpdf">
          <a download :href="trackchecks.link"><img :src="icon.exel" alt="Alt"></a>
          <a download :href="trackchecks.linkpdf"><img :src="icon.pdf" alt="Alt"></a>
         </div>

         <table class="table table-hover table-sm">
          <thead>
          <tr>
           <th class="text-center th-font">Начало движения</th>
           <th class="text-center th-font">Конец движения</th>
           <th class="text-center th-font">Скорость в начале</th>
           <th class="text-center th-font">Скорость в конце</th>
           <th class="text-center th-font">Длительность</th>
           <th class="text-center th-font">Расстояние</th>
           <th class="text-center th-font">С последнего сигнала</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(trackcheck) in trackchecks.data" :key="trackcheck.id">
           <td class="text-center">{{trackcheck.starttime}}</td>
           <td class="text-center">{{trackcheck.endtime}}</td>
           <td class="text-center">{{trackcheck.speedafter}}</td>
           <td class="text-center">{{trackcheck.speedbefore}}</td>
           <td class="text-center">{{trackcheck.duration}}</td>
           <td class="text-center">{{trackcheck.distance}}</td>
           <td class="text-center">{{trackcheck.gapTime}}</td>

          </tr>
          </tbody>
         </table>

        </div>
       </div>
      </slot>
     </Tab>







     <Tab :isSelected="selected === 'Отчет по работе навигационного оборудования (групповой)'">
      <slot>
       <div class="v_tab_table mr-2">
        <div v-for="(trackCheckGroups) in getTrackCheckGroup">

         <div class="download-links" v-if="trackCheckGroups.linkpdf">
          <a download :href="trackCheckGroups.link"><img :src="icon.exel" alt="Alt"></a>
          <a download :href="trackCheckGroups.linkpdf"><img :src="icon.pdf" alt="Alt"></a>
         </div>


         <div v-for="trackCheckGroup in trackCheckGroups.data">
          <p class="v_tab_table_name">{{trackCheckGroup.name}}</p>
          <table class="table table-hover table-sm">

           <thead>
           <tr>
            <th class="text-center th-font">Начало движения</th>
            <th class="text-center th-font">Конец движения</th>
            <th class="text-center th-font">Скорость в начале</th>
            <th class="text-center th-font">Скорость в конце</th>
            <th class="text-center th-font">Длительность</th>
            <th class="text-center th-font">Расстояние</th>
            <th class="text-center th-font">С последнего сигнала</th>
           </tr>
           </thead>
           <tbody>
           <tr v-for="(trackcheck) in trackCheckGroup.data">
            <td class="text-center">{{trackcheck.starttime}}</td>
            <td class="text-center">{{trackcheck.endtime}}</td>
            <td class="text-center">{{trackcheck.speedafter}}</td>
            <td class="text-center">{{trackcheck.speedbefore}}</td>
            <td class="text-center">{{trackcheck.duration}}</td>
            <td class="text-center">{{trackcheck.distance}}</td>
            <td class="text-center">{{trackcheck.gapTime}}</td>

           </tr>
           </tbody>
          </table>
         </div>
        </div>
       </div>
      </slot>
     </Tab>






     <Tab :isSelected="selected === 'Отчет по дискретным сенсорам'">
      <slot>
       <div class="v_tab_table mr-2">
        <div v-for="(sensorChecks) in getSensorCheck">

         <div class="download-links" v-if="sensorChecks.linkpdf">
          <a download :href="sensorChecks.link"><img :src="icon.exel" alt="Alt"></a>
          <a download :href="sensorChecks.linkpdf"><img :src="icon.pdf" alt="Alt"></a>
         </div>

         <table class="table table-hover table-sm" v-for="(sensorCheck) of sensorChecks.data">
          <thead>
          <tr>
           <th class="text-center"><span class="th-font">Датчик</span> "{{sensorCheck.sensor}}"</th>
           <th class="text-center th-font">Начало движения</th>
           <th class="text-center th-font">Конец движения</th>
           <th class="text-center th-font">Длительность</th>
           <th class="text-center th-font">Расстояние</th>
           <th class="text-center th-font">Датчик</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(element) of sensorCheck.data">
           <td class="text-center"></td>
           <td class="text-center">{{element.starttime}}</td>
           <td class="text-center">{{element.endtime}}</td>
           <td class="text-center">{{element.duration}}</td>
           <td class="text-center">{{element.distance}}</td>
           <td class="text-center">{{element.sensor}}</td>
          </tr>
          </tbody>

         </table>

        </div>
       </div>
      </slot>
     </Tab>












     <Tab :isSelected="selected === 'Отчет по дискретным сенсорам (групповой)'">
      <slot>
       <div class="v_tab_table mr-2">
        <div v-for="(sensorCheckGroups) in getSensorCheckGroup">

         <div class="download-links" v-if="sensorCheckGroups.linkpdf">
          <a download :href="sensorCheckGroups.link"><img :src="icon.exel" alt="Alt"></a>
          <a download :href="sensorCheckGroups.linkpdf"><img :src="icon.pdf" alt="Alt"></a>
         </div>


         <div v-for="sensorCheckGroup in sensorCheckGroups.data">
          <p class="v_tab_table_name">{{sensorCheckGroup.name}}</p>
          <table class="table table-hover table-sm" v-for="element in sensorCheckGroup.data">

           <thead>
           <tr>
            <th class="text-center"><span class="th-font">Датчик</span> "{{element.sensor}}"</th>
            <th class="text-center th-font">Начало движения</th>
            <th class="text-center th-font">Конец движения</th>
            <th class="text-center th-font">Длительность</th>
            <th class="text-center th-font">Расстояние</th>
            <th class="text-center th-font">Датчик</th>
           </tr>
           </thead>
           <tbody>
           <tr v-for="(trackcheck) in element.data" :key="trackcheck.id">
            <td class="text-center"></td>
            <td class="text-center">{{trackcheck.starttime}}</td>
            <td class="text-center">{{trackcheck.endtime}}</td>
            <td class="text-center">{{trackcheck.duration}}</td>
            <td class="text-center">{{trackcheck.distance}}</td>
            <td class="text-center">{{trackcheck.sensor}}</td>
           </tr>
           </tbody>
          </table>
         </div>
        </div>
       </div>
      </slot>
     </Tab>















     <Tab :isSelected="selected === 'По пробегу (короткий)'">
      <slot>
       <div class="v_tab_table mr-2">
        <div v-for="(mileage) in getMileageShort">

         <div class="download-links" v-if="mileage.linkpdf">
          <a download :href="mileage.link"><img :src="icon.exel" alt="Alt"></a>
          <a download :href="mileage.linkpdf"><img :src="icon.pdf" alt="Alt"></a>
         </div>

         <table class="table table-hover table-sm">
          <thead>
          <tr>
           <th class="text-center th-font">Начало движения</th>
           <th class="text-center th-font">Конец движения</th>
           <th class="text-center th-font">Время движения</th>
           <th class="text-center th-font">Пробег м.</th>
           <th class="text-center th-font">Среедняя скорость км\ч</th>
           <th class="text-center th-font">Адрес</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(mileage) in mileage.data" :key="mileage.id">
           <td class="text-center">{{mileage.starttime}}</td>
           <td class="text-center">{{mileage.endtime}}</td>
           <td class="text-center">{{mileage.duration}}</td>
           <td class="text-center">{{mileage.distance}}</td>
           <td class="text-center">{{mileage.avgSpeed}}</td>
           <td class="text-center">{{mileage.address}}</td>
          </tr>
          </tbody>
         </table>

        </div>
       </div>
      </slot>
     </Tab>

     <Tab :isSelected="selected === 'По пробегу (полный)'">
      <slot>
       <div class="v_tab_table mr-2">
        <div v-for="(mileage) in getMileageFull">

         <div class="download-links" v-if="mileage.linkpdf">
          <a download :href="mileage.link"><img :src="icon.exel" alt="Alt"></a>
          <a download :href="mileage.linkpdf"><img :src="icon.pdf" alt="Alt"></a>
         </div>

         <table class="table table-hover table-sm">
          <thead>
          <tr>
           <th class="text-center th-font">Начало движения</th>
           <th class="text-center th-font">Конец движения</th>
           <th class="text-center th-font">Время движения</th>
           <th class="text-center th-font">Пробег м.</th>
           <th class="text-center th-font">Среедняя скорость км\ч</th>
           <th class="text-center th-font">Макс. скорость км\ч</th>
           <th class="text-center th-font">Городской пробег</th>
           <th class="text-center th-font">Загородный пробег</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(mileage) in mileage.data" :key="mileage.id">
           <td class="text-center">{{mileage.starttime}}</td>
           <td class="text-center">{{mileage.endtime}}</td>
           <td class="text-center">{{mileage.duration}}</td>
           <td class="text-center">{{mileage.distance}}</td>
           <td class="text-center">{{mileage.avgSpeed}}</td>
           <td class="text-center">{{mileage.maxspeed}}</td>
           <td class="text-center">{{mileage.mileagecity}}</td>
           <td class="text-center">{{mileage.mileageout}}</td>
          </tr>
          </tbody>
         </table>

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
    getGeoZoneOverSpeed: 'getGeoZoneOverSpeed',
    getMileageShort: 'getMileageShort',
    getMileageFull: 'getMileageFull',

    getTrackCheck: 'getTrackCheck',
    getTrackCheckGroup: 'getTrackCheckGroup',
    getSensorCheck: 'getSensorCheck',
    getSensorCheckGroup: 'getSensorCheckGroup',

   }),
   tabName() {
    let prepareTabList = []

    if (this.getTrackCheck?.length) {
     prepareTabList.push({alias: 'trackCheck', tab: 'Отчет по работе навигационного оборудования'})
     // this.selected = 'По движению/стоянкам'
    }

    if (this.getTrackCheckGroup?.length) {
     prepareTabList.push({alias: 'trackCheckGroup', tab: 'Отчет по работе навигационного оборудования (групповой)'})
     // this.selected = 'По движению/стоянкам'
    }

    if (this.getSensorCheck?.length) {
     prepareTabList.push({alias: 'sensorCheck', tab: 'Отчет по дискретным сенсорам'})
     // this.selected = 'По движению/стоянкам'
    }

    if (this.getSensorCheckGroup?.length) {
     prepareTabList.push({alias: 'sensorCheckGroup', tab: 'Отчет по дискретным сенсорам (групповой)'})
     // this.selected = 'По движению/стоянкам'
    }

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

    if (this.getMileageShort?.length) {
     prepareTabList.push({alias: 'mileageShort', tab: 'По пробегу (короткий)'})
     // this.selected = 'Превышение скорости в геозонах'
    }

    if (this.getMileageFull?.length) {
     prepareTabList.push({alias: 'mileageFull', tab: 'По пробегу (полный)'})
     // this.selected = 'Превышение скорости в геозонах'
    }
    return prepareTabList
   }
  },

  watch: {
   getSensorCheckGroup: {
    handler(newValue, oldValue) {
     if (newValue) {
      setTimeout(() => {
       this.selected = 'Отчет по дискретным сенсорам (групповой)'
      }, 100)
     } else {
      this.selected = this.tabName[0].tab
     }
    },
    immediate: true,
    deep: true
   },

   getSensorCheck: {
    handler(newValue, oldValue) {
     if (newValue) {
      setTimeout(() => {
       this.selected = 'Отчет по дискретным сенсорам'
      }, 100)
     } else {
      this.selected = this.tabName[0].tab
     }
    },
    immediate: true,
    deep: true
   },

   getTrackCheckGroup: {
    handler(newValue, oldValue) {
     if (newValue) {
      setTimeout(() => {
       this.selected = 'Отчет по работе навигационного оборудования (групповой)'
      }, 100)
     } else {
      this.selected = this.tabName[0].tab
     }
    },
    immediate: true,
    deep: true
   },

   getTrackCheck: {
    handler(newValue, oldValue) {
     if (newValue) {
      setTimeout(() => {
       this.selected = 'Отчет по работе навигационного оборудования'
      }, 100)
     } else {
      this.selected = this.tabName[0].tab
     }
    },
    immediate: true,
    deep: true
   },


   getMileageFull: {
    handler(newValue, oldValue) {
     if (newValue) {
      setTimeout(() => {
       this.selected = 'По пробегу (полный)'
      }, 100)
     } else {
      this.selected = this.tabName[0].tab
     }
    },
    immediate: true,
    deep: true
   },


   getMileageShort: {
    handler(newValue, oldValue) {
     if (newValue) {
      setTimeout(() => {
       this.selected = 'По пробегу (короткий)'
      }, 100)
     } else {
      this.selected = this.tabName[0].tab
     }
    },
    immediate: true,
    deep: true
   },

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

     case 'sensorCheckGroup':
      this.$store.state.raport.sensorCheckGroup = null
      this.tabName.filter(el => {
       return el.alias !== 'sensorCheckGroup'
      })
      break;

     case 'sensorCheck':
      this.$store.state.raport.sensorCheck = null
      this.tabName.filter(el => {
       return el.alias !== 'sensorCheck'
      })
      break;

     case 'trackCheckGroup':
      this.$store.state.raport.trackCheckGroup = null
      this.tabName.filter(el => {
       return el.alias !== 'trackCheckGroup'
      })
      break;

     case 'trackCheck':
      this.$store.state.raport.trackCheck = null
      this.tabName.filter(el => {
       return el.alias !== 'trackCheck'
      })
      break;


     case 'mileageFull':
      this.$store.state.raport.mileagefull = null
      this.tabName.filter(el => {
       return el.alias !== 'mileageFull'
      })
      break;

     case 'mileageShort':
      this.$store.state.raport.mileageshort = null
      this.tabName.filter(el => {
       return el.alias !== 'mileageShort'
      })
      break;

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