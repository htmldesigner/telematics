<template>
 <div class="addCheckPoint-container" v-draggable="draggableValue" style="z-index: 9999; cursor: pointer; left: 600px; top: 100px; position: absolute">
  <div class="addCheckPoint-header bg-blue d-flex justify-content-between align-items-center px-3" :ref="handleId">
   <p class="addCheckPoint-title m-0 p-0">Добавить контрольную точку</p>
   <img style="width: 18px;" :src="icon.remove" @click="closeWindow" alt="Alt">
  </div>

<!--  <div class="addCheckPoint-body p-2 mt-2">-->

<!--   <div class="form-group row">-->
<!--    <label  class="col-sm-4 custom-form-label">Поиск по адресу:</label>-->
<!--    <div class="col-sm-8">-->
<!--     <input type="text" class="input-custom" v-model="setAddress" @input="findLatLng" @click="addressListToggler = true"-->
<!--     >-->
<!--    </div>-->
<!--   </div>-->

<!--   <div class="d-flex" style="position: relative" v-if="findedByAddress && addressListToggler">-->
<!--    <ul class="textboxlist">-->
<!--     <li v-for="address in findedByAddress"-->
<!--         @click="getAddress(address.text, address.latlng), addressListToggler = !addressListToggler">{{address.text}}-->
<!--     </li>-->
<!--    </ul>-->
<!--   </div>-->

<!--   <div class="form-group row">-->
<!--    <label  class="col-sm-4 custom-form-label">Широта:</label>-->
<!--    <div class="col-sm-8">-->
<!--     <input type="text" class="input-custom" v-model="latitude" >-->
<!--    </div>-->
<!--   </div>-->

<!--   <div class="form-group row">-->
<!--    <label  class="col-sm-4 custom-form-label">Долгота:</label>-->
<!--    <div class="col-sm-8">-->
<!--     <input type="text" class="input-custom" v-model="longitude" >-->
<!--    </div>-->
<!--   </div>-->

<!--   <div class="d-flex justify-content-end mb-3">-->
<!--    <button class="btn-custom-outline" @click="showControlPoint()">Показать на карте</button>-->
<!--   </div>-->

<!--   <div class="form-group mb-2 row">-->
<!--    <label class="col-sm-2 custom-form-label">Адрес</label>-->
<!--    <div class="col-sm-10">-->
<!--     <textarea style="resize: none; height: 80px" v-model="address" class="input-custom"></textarea>-->
<!--    </div>-->
<!--   </div>-->

<!--   <button class="btn-custom-outline float-right" @click="onSubmitPoint">Добавить контрольную точку</button>-->

<!--  </div>-->

 </div>
</template>

<script>
 import {mapGetters, mapState} from "vuex";
 import * as ELG from "esri-leaflet-geocoder";
 import { Draggable } from 'draggable-vue-directive'
 export default {
  directives: {
   Draggable,
  },
  name: "geoZonePoint",
  data() {
   return {
    controlPointGroup: new L.featureGroup(),

    latitude: null,
    longitude: null,
    address: null,

    // Helper variables
    findedByAddress: null,
    addressListToggler: false,
    setAddress: null,

    icon: {
     remove: require('@/assets/remove-white.svg'),
     mapMarker: require('@/assets/map-marker.svg'),
     addPointMarker: L.icon({
      iconUrl: require('@/assets/marker-red.svg'),
      iconSize: [22, 22],
      iconAnchor: [12, 16]
     }),
    },
    handleId: "handle-id",
    draggableValue: {
     handle: undefined
    }
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
  },

  methods: {

   addMarker(param) {
    let self = this
    this.controlPointGroup.clearLayers()

    let newMarker = new L.marker(param.latlng || param, {
     icon: this.icon.addPointMarker
    });
    this.controlPointGroup.addLayer(newMarker)

    this.latitude = newMarker._latlng.lat
    this.longitude = newMarker._latlng.lng

    if (param.latlng) {
     let geocodeService = ELG.geocodeService()
     geocodeService.reverse().latlng([newMarker._latlng.lat, newMarker._latlng.lng])
      .run(function (error, result) {
       if (error) {
        return;
       }
       self.address = `${result.address?.ShortLabel + ' ,' + result.address?.District + ', ' + result.address?.Region}`
      })
    }
   },

   findLatLng(e) {
    console.log(e.target.value)
    let self = this
    let geocodeService = ELG.geocodeService()
    geocodeService.geocode().text(e.target.value).run(function (error, results) {
     if (error) {
      return;
     }
     if (results?.results.length) {
      console.log(results)
      self.findedByAddress = results.results
     } else {
      self.findedByAddress = null
     }
    })
   },

   getAddress(text, latlng) {
    this.address = text
    this.setAddress = text
    this.showControlPoint(latlng)
    this.addMarker(latlng)
   },

   showControlPoint(latlng) {
    if (latlng) {
     this.latitude = latlng.lat
     this.longitude = latlng.lng
    }

    if (this.latitude && this.longitude)
     this.mapInstance.flyTo([this.latitude, this.longitude])
   },

   onSubmitPoint(){
    if (this.address && this.longitude && this.latitude){
     const newPoint = {
      address: this.address.trim(),
      name: this.address.trim(),
      lat: this.latitude,
      lon: this.longitude,
      radius: 100
     }
     this.$emit('add-point', newPoint)
    }


   },

   closeWindow() {
    this.$emit('close')
    this.controlPointGroup.remove()
    this.mapInstance.off('click', this.addMarker)
    L.DomUtil.removeClass(this.mapInstance._container, 'cursor-enabled')
   }

  },
  mounted() {
   this.draggableValue.handle = this.$refs[this.handleId];
   this.controlPointGroup.addTo(this.mapInstance)
   this.mapInstance.on('dblclick', this.addMarker)
   L.DomUtil.addClass(this.mapInstance._container, 'cursor-enabled')
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