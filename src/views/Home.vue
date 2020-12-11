<template>
 <div v-if="isUserLoggedIn">
  <Loader v-if="load"/>
  <nav class="navbar navbar-expand-xl navbar-dark bg-blue">
   <a class="navbar-brand mr-3" href="/">
    <img src="@/assets/logo.svg" alt="Alt">
   </a>
   <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
           aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
   </button>
   <div class="collapse navbar-collapse" id="navbarText">

    <ul class="navbar-nav mr-auto">
     <li v-for="(link, index) in links"
         :key="index" class="nav-item"
         v-bind:class="{active: currentComponent ===  link.alias}">
      <span class="nav-link text-light"
            @click.prevent="currentLink = link.alias">{{link.title}}
      </span>
     </li>
    </ul>

    <ul class="navbar-nav">
     <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" ref="dropdownList" href="#" id="navbarDropdownMenuLink" role="button"
         data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
       {{UserInfo.first_name + ' ' + UserInfo.last_name}}
      </a>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
       <a class="dropdown-item" href="/profile">Профиль</a>
       <a class="dropdown-item" href=""
          @click.prevent="showModal = true"
       >
        Настройки
       </a>
       <a v-if="isUserLoggedIn" class="dropdown-item" href="" @click.prevent="logout">Выход</a>
      </div>
     </li>
    </ul>

   </div>
  </nav>

  <sittings v-if="showModal" @close="showModal = false">
   <template v-slot:header>
   </template>
   <template v-slot:body>
   </template>
   <template v-slot:footer>
   </template>
  </sittings>

  <div class="container-fluid">
   <div class="row">
    <splitpanes class="default-theme" @resize="paneSize = $event[0].size, paneSizeResize()"
                style="height: calc(100vh - 40px)">
     <pane min-size="15" max-size="50" :size="paneSize" style="overflow-y: auto;">
      <keep-alive>
       <component
        :is="currentComponent"
        @on-Action="onAction"
        @modalObjectList="modalObjectListRun"
        @modalGeoZoneList="modalGeoZoneListRun"
        @add-schedule="scheduleRun"
        @add-round="roundRun"
        @roundList="roundListRun"
        @editSchedule="editScheduleRun"
       ></component>
      </keep-alive>
     </pane>

     <pane min-size="60" :size="100 - paneSize" max-size="100">
      <splitpanes horizontal @resized="horizontSplitResize">
       <pane>
        <llmap ref="llmap"></llmap>
        <modalOL v-if="modalObjectLoader" @close="modalObjectLoader = false"></modalOL>
        <modalGL v-if="modalGeoZoneLoader" @close="modalGeoZoneLoader = false"></modalGL>
        <createSchedule v-if="createScheduleShow" @close="createScheduleShow = false"
                        :routeId="routeId"></createSchedule>
        <editSchedule v-if="editScheduleShow" @close="editScheduleShow = false" :scheduleId="scheduleId"></editSchedule>
        <createRound v-if="createRoundShow" @close="createRoundShow = false" :routeId="routeId"
                     :scheduleId="scheduleId"></createRound>
        <roundsList v-if="roundsListShow" @close="roundsListShow = false" @setNewProps="setNewProps" :roundId="roundId"></roundsList>
       </pane>

       <pane v-if="currentLink === 'tracker' && getOverSpeedTrack"
             max-size="90" min-size="5">
        <trackerRaport ref="trackerRaport" style="overflow-y: scroll"/>
       </pane>

       <pane
        v-if="currentLink === 'raports' && (getTrackGroup || getGroupGeoZone || getGroupOverSpeed || getGeoZoneOverSpeed || getMileageShort || getMileageFull)"
        max-size="100" min-size="5" style="overflow-y: scroll">
        <raportPanel/>
       </pane>

      </splitpanes>

     </pane>

    </splitpanes>
   </div>
  </div>

 </div>
</template>

<script>
 import $ from 'jquery'
 import monitoring from "../components/monitoring/monitoring";
 import tracker from "../components/tracker/tracker";
 import sittings from "../components/settings/settings";
 import raports from "../components/raport/raports";
 import routes from "../components/routes/routes";
 import geozone from "../components/geozone/geozone";
 import drawnew from "../components/drawnew/drawnew";
 import llmap from '../components/llmap';
 import trackerRaport from "../components/tracker/trackerPanel";
 import raportPanel from "../components/raport/raportPanel";
 import modalOL from "../components/monitoring/modalObjectLoader";
 import modalGL from "../components/geozone/modalGeoZoneLoader";
 import createSchedule from "../components/routes/createSchedule";
 import editSchedule from "../components/routes/editSchedule";
 import createRound from "../components/routes/createRound";
 import roundsList from "../components/routes/roundsList";
 import {Splitpanes, Pane} from 'splitpanes'
 import 'splitpanes/dist/splitpanes.css'
 import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
 import Loader from "../components/Loader";
 import {eventBus} from "../eventBus";

 export default {
  components: {
   llmap,
   trackerRaport,
   monitoring,
   sittings,
   raports,
   routes,
   raportPanel,
   geozone,
   drawnew,
   tracker,
   Splitpanes,
   Pane,
   modalOL,
   modalGL,
   Loader,
   createSchedule,
   editSchedule,
   createRound,
   roundsList
  },
  computed: {
   ...mapGetters({
    objects: 'getObjects',
    getPaneSize: 'getPaneSize',
    getCurrentComponent: 'getCurrentComponent',
    UserInfo: 'getUserInfo',
    getOverSpeedTrack: 'getOverSpeedTrack',

    getTrackGroup: 'getTrackGroup',
    getGroupGeoZone: 'getGroupGeoZone',
    getGroupOverSpeed: 'getGroupOverSpeed',
    getGeoZoneOverSpeed: 'getGeoZoneOverSpeed',
    getMileageShort: 'getMileageShort',
    getMileageFull: 'getMileageFull',

   }),
   currentLink: {
    set(val) {
     this.SETCURRENTCOMPONENT(val)
    },
    get() {
     return this.getCurrentComponent
    }
   },
   paneSize: {
    set(val) {
     this.SETPANESIZE(val)
    },
    get() {
     return this.getPaneSize
    }
   },
   currentComponent: function () {
    return this.currentLink;
   },

   isUserLoggedIn() {
    return this.$store.getters.isUserLoggedIn
   },

   links() {
    if (this.isUserLoggedIn) {
     return [
      {title: 'Мониторинг', alias: 'monitoring', icon: 'mdi-earth'},
      {title: 'Треки', alias: 'tracker', icon: 'mdi-flag-checkered'},
      {title: 'Маршруты', alias: 'routes', icon: 'mdi-flag-checkered'},
      {title: 'Отчеты', alias: 'raports', icon: 'mdi-playlist-check'},
      {title: 'Геозоны', alias: 'geozone', icon: 'mdi-shape-polygon-plus'},
     ]
    }
   }
  },
  data() {
   return {
    showModal: false,
    modalObjectLoader: false,
    modalGeoZoneLoader: false,
    createScheduleShow: false,
    editScheduleShow: false,
    createRoundShow: false,
    roundsListShow: false,
    roundId: null,
    routeId: null,
    scheduleId: null,
    load: true,
   }
  },
  methods: {
   ...mapMutations(['SETPANESIZE', 'SETCURRENTCOMPONENT']),
   ...mapState('mapModule', ['mapInstance']),

   /**
    * Responsive map interface belong with "Splitpanes" component
    */
   paneSizeResize() {
    setTimeout(() => {
     this.mapInstance().invalidateSize()
    }, 400)
   },

   horizontSplitResize() {
    this.paneSizeResize()
   },

   onAction(action, idGroup) {
    switch (action) {
     case "hide":
      this.$refs.llmap.drawHide();
      break;
     case "show":
      this.$refs.llmap.drawShow();
      break;
     case "clear":
      this.$refs.llmap.drawClear();
      break;
     case "save":
      this.$refs.llmap.saveList(this.$refs.llmap.drawGetGeozones(), idGroup);
      break;
    }
   },

   modalObjectListRun() {
    this.modalObjectLoader = !this.modalObjectLoader
   },
   modalGeoZoneListRun() {
    this.modalGeoZoneLoader = !this.modalGeoZoneLoader
   },

   // For Schedule component
   // Создать расписание
   scheduleRun(schedule) {
    this.roundsListShow = false
    this.createRoundShow = false
    this.editScheduleShow = false
    this.createScheduleShow = schedule.status
    this.routeId = schedule.id
   },

   //Создать рейс
   roundRun(round) {
    this.roundsListShow = false
    this.createScheduleShow = false
    this.editScheduleShow = false
    this.createRoundShow = round.status
    this.routeId = round.route_id
    this.scheduleId = round.schedule_id
    console.log(round)
   },

   // Список рейсов к по маршруту
   roundListRun(round) {
    this.createScheduleShow = false
    this.createRoundShow = false
    this.editScheduleShow = false
    this.roundsListShow = round.status
    this.roundId = round.id
    // this.scheduleId = round.schedule_id
   },

   // Редактировать расписание
   editScheduleRun(schedule) {
    this.createScheduleShow = false
    this.createRoundShow = false
    this.editScheduleShow = schedule.status
    this.scheduleId = schedule.id
   },

   setNewProps(value){
    this.roundId = value
   },

   logout() {
    this.$store.dispatch('logout').then(() => {
     this.$router.push('/')
    })
   },

  },


  async mounted() {
   if (this.isUserLoggedIn) {
    await this.$store.dispatch('getUserInfo')
    await this.$store.dispatch('loadObjects')
    await this.$store.dispatch('loadGeozones')
    await this.$store.dispatch('loadState')
    await this.$store.dispatch('getRouteList')
   }

   this.load = false

   setTimeout(() => {
    this.mapInstance().invalidateSize()
   }, 400)
   $('.dropdown-toggle').dropdown()


   eventBus.$on('closePanel', () => {
     this.createScheduleShow =  false
     this.editScheduleShow =  false
     this.createRoundShow =  false
     this.roundsListShow =  false
   });


  },
 }
</script>

<style scoped>
 .dropdown-menu {
  z-index: 2000;
 }
</style>