<template>
 <div>
  <nav class="navbar navbar-expand-xl navbar-dark bg-blue">
   <a class="navbar-brand mr-3" href="/">
    <img src="/img/logo.svg" alt="Alt">
   </a>
   <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
           aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
   </button>
   <div class="collapse navbar-collapse" id="navbarText">

    <ul class="navbar-nav mr-auto">
     <li v-for="(link, index) in links" :key="index" class="nav-item">
      <a href="" class="nav-link text-light" @click.prevent="currentLink = link.alias">{{link.title}}</a>
     </li>
    </ul>

    <ul class="navbar-nav">
     <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" ref="dropdownList" href="#" id="navbarDropdownMenuLink" role="button"
         data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
       {{UserInfo.username}}
      </a>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
       <a class="dropdown-item" href="/profile/">Профиль</a>
       <a class="dropdown-item" href="/option/">Настройки</a>
      </div>
     </li>
     <li class="nav-item">
      <a href="/login" class="nav-link">Выход</a>
     </li>
    </ul>

   </div>
  </nav>

  <div class="container-fluid">
   <div class="row">
    <splitpanes class="default-theme" @resize="paneSize = $event[0].size, paneSizeResize()"
                style="height: calc(100vh - 56px)">
     <pane min-size="15" max-size="50" :size="paneSize">
      <keep-alive>
       <component :is="currentComponent" @on-Action="onAction"></component>
      </keep-alive>
     </pane>
     <pane min-size="60" :size="100 - paneSize" max-size="100">
      <splitpanes horizontal>

       <pane min-size="10">
        <llmap ref="llmap"></llmap>
       </pane>

<!--       <pane v-if="currentLink === 'tracker'"-->
<!--             mix-size="90" style="background-color:#f5f5f5 !important; overflow: scroll">-->
<!--        <Playback ref="playback"/>-->
<!--       </pane>-->

       <pane v-if="currentLink === 'raports'"
             mix-size="90" style="background-color:#f5f5f5 !important; overflow: scroll">
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
 import sittings from "../components/settings/sittings";
 import raports from "../components/raport/raports";
 import geozone from "../components/geozone/geozone";
 import drawnew from "../components/drawnew/drawnew";
 import llmap from '../components/llmap';
 import Playback from "../components/Playback";
 import raportPanel from "../components/raport/raportPanel";

 import {Splitpanes, Pane} from 'splitpanes'
 import 'splitpanes/dist/splitpanes.css'

 import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
 import {eventBus} from '../eventBus'

 export default {
  components: {
   llmap,
   Playback,
   monitoring,
   sittings,
   raports,
   raportPanel,
   geozone,
   drawnew,
   tracker,
   Splitpanes,
   Pane
  },
  computed: {
   ...mapGetters({
    objects: 'getObjects',
    getPaneSize: 'getPaneSize',
    getCurrentComponent: 'getCurrentComponent',
    UserInfo: 'getUserInfo'
   }),
   currentLink: {
    set(val) {
     this.setCurrentComponent(val)
    },
    get() {
     return this.getCurrentComponent
    }
   },
   paneSize: {
    set(val) {
     this.setPaneSize(val)
    },
    get() {
     return this.getPaneSize
    }
   },
   currentComponent: function () {
    return this.currentLink;
   },
  },
  data() {
   return {
    links: [
     {title: 'Мониторинг', alias: 'monitoring', icon: 'mdi-earth'},
     {title: 'Треки', alias: 'tracker', icon: 'mdi-flag-checkered'},
     {title: 'Отчеты', alias: 'raports', icon: 'mdi-playlist-check'},
     {title: 'Геозоны', alias: 'geozone', icon: 'mdi-shape-polygon-plus'},
    ]
   }
  },
  methods: {
   ...mapMutations(['setPaneSize', 'setCurrentComponent']),
   ...mapState('mapModule', ['mapInstance']),
   //Responsive map interface belong with "Splitpanes" component
   paneSizeResize() {
    setTimeout(() => {
     this.mapInstance().invalidateSize()
    }, 400)
   },

   onAction(action) {
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
      this.$refs.llmap.saveList(this.$refs.llmap.drawGetGeozones());
      break;
    }
   },
  },

  mounted() {
   setTimeout(() => {
    this.mapInstance().invalidateSize()
   }, 400)
   $('.dropdown-toggle').dropdown()
   this.$refs.llmap.zoomSliderShow()
  },

  created() {
  }

 }
</script>

<style scoped>
 .dropdown-menu {
  z-index: 2000;
 }
</style>