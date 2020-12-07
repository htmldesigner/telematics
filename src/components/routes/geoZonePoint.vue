<template>
 <div class="addCheckPoint-container" v-draggable="draggableValue"
      style="z-index: 9999; cursor: pointer; left: 800px; top: 200px; position: absolute">
  <div class="addCheckPoint-header bg-blue d-flex justify-content-between align-items-center px-3" :ref="handleId">
   <p class="addCheckPoint-title m-0 p-0">Добавить контрольную геозону</p>
   <img style="width: 18px;" :src="icon.remove" @click="closeWindow" alt="Alt">
  </div>

  <div class="addCheckPoint-body p-2 mt-2">
   <div class="form-group row">
    <div class="col">
     <input type="text" class="input-custom" placeholder="Поиск" v-model="searchZone"
     >
    </div>
   </div>

   <div style="overflow: auto; height: 260px">
    <ul class="geozone-list">
     <li v-for="(geoZone, index) of filtredGeoZone" :key="geoZone.id"
         class="d-flex justify-content-between"
     >
      <span @click="onSubmitGeoZone(geoZone.id)">{{geoZone.name}}</span>
      <img :src="icon.showZone" class="mr-3" v-tooltip="'Паказать на карте'" @click.prevent="getGeoZoneById(geoZone.id)"
           alt="Alt">
     </li>
    </ul>
   </div>

  </div>
 </div>
</template>

<script>
 import {mapGetters, mapState} from "vuex";
 import * as ELG from "esri-leaflet-geocoder";
 import {Draggable} from 'draggable-vue-directive'

 export default {
  directives: {
   Draggable,
  },
  name: "geoZonePoint",
  data() {
   return {
    controlZone: new L.featureGroup(),

    latitude: null,
    longitude: null,
    address: null,
    name: null,
    coordinates: null,
    geoZoneId: null,
    // Helper variables
    searchZone: '',

    icon: {
     showZone: require('@/assets/watch-blue.svg'),
     remove: require('@/assets/remove-white.svg')
    },
    handleId: "handle-id",
    draggableValue: {
     handle: undefined
    }
   }
  },
  props: {
   getGeozones: {
    type: Object
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    getGeoZoneCheckPoint: 'getGeoZoneCheckPoint'
   }),
   filtredGeoZone() {
    return Object.values(this.getGeozones).filter(el => {
     return el.name.toLowerCase().indexOf(this.searchZone.toLowerCase()) !== -1
    })
   }
  },
  watch: {
   getGeoZoneCheckPoint: {
    handler(val) {
     this.prepareGeoZone(val)
    }
   }
  },

  methods: {

   async getGeoZoneById(id) {
    await this.$store.dispatch('getCheckPointGeozone', id)
   },

   prepareGeoZone(zone) {
    let geometry = JSON.parse(zone.geom)

    this.address = zone.name
    this.name = zone.name
    this.coordinates = geometry
    this.coordinates.properties = {color: zone.color}
    this.geoZoneId = zone.id

    let prepareGeoJson = {
     type: "Feature",
     id: zone.id,
     properties: {
      name: zone.name,
      description: zone.description,
      color: zone.color
     },
     "geometry": geometry
    }

    this.renderZone(prepareGeoJson)
    geometry = null
    prepareGeoJson = null
   },

   renderZone(zone) {
    this.controlZone.clearLayers()
    let style = () => {
     return {
      color: zone.properties.color
     }
    }
    let readyZone = L.geoJSON(zone, {style: style})
    let zoneCenter = readyZone.getBounds().getCenter()
    this.latitude = zoneCenter.lat
    this.longitude = zoneCenter.lng
    this.controlZone.addLayer(readyZone)
    this.mapInstance.flyToBounds(readyZone.getBounds(), {duration: 1, maxZoom: 12})
   },

   async onSubmitGeoZone(id) {
    await this.$store.dispatch('getCheckPointGeozone', id)
    if (this.address && this.coordinates && this.geoZoneId && this.latitude && this.longitude) {
     const addZone = {
      address: this.address.trim(),
      name: this.address.trim(),
      geom: this.coordinates,
      geozone_id: this.geoZoneId,
      lat: this.latitude,
      lon: this.longitude,
      radius: -1
     }
     this.$emit('add-geoZone', addZone)
    } else {
     console.log('not')
    }

    // this.address = null
    // this.name = null
    // this.coordinates = null
    // this.geoZoneId = null
   },

   closeWindow() {
    this.$emit('close')
    this.controlZone.remove()
   }

  },
  mounted() {
   this.draggableValue.handle = this.$refs[this.handleId];
   this.controlZone.addTo(this.mapInstance)
  }
 }
</script>

<style scoped>
 .addCheckPoint-container {
  width: 400px;
  height: 370px;
  background-color: #fff;
  position: relative;
 }

 .addCheckPoint-header {
  width: 100%;
  height: 30px;
  color: #fff;
  font-size: 12px;
 }

 .textboxlist {
  position: absolute;
  top: -15px;
  height: auto !important;
  max-height: 170px;
  background: #fff;
  border: 1px solid #999;
  z-index: 9999;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  padding: 0 5px;
 }

 .textboxlist li {
  list-style-type: none;
  background: #fff;
  font-size: 12px;
 }

</style>