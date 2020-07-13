<template>
 <div>
  <div class="monitoring-container">
   <input class="monitoring_filter" type="text" placeholder="Введите название, IMEI, регномер" name="query"
          v-model="search">
  </div>
  <div class="table-responsive">
   <table class="table">
    <thead>
    <tr>
     <th>
      <input type="checkbox" @change="selectAllObject()">
     </th>
     <th>
    <tbody>
    <tr>
     <td>
      <div class="monitoring_panel">
       <div class="monitoring_sort">
        <img class="size_16" src="/img/sort-up.png" alt="Alt">
       </div>
       <div class="monitoring_list" v-on:click="$emit('component-link', 'monitoringGroup')">
        <img class="size_16" src="/img/list.png" alt="Alt">
       </div>
      </div>
     </td>
    </tr>
    </tbody>
    </th>
    <th></th>
    <th></th>
    <th></th>
    </tr>
    </thead>
    <tbody>

    <tr v-for="(object, index) in filtered"
        :key="index"
    >
     <td>

      <input type="checkbox" :checked="object.selected"
             @change="objectSelect(object.id, object.selected = !object.selected)"
      ></td>

     <td>
      <img class="size_16 monitoring_units_custom_icon_16917756" id="monitoring_units_custom_icon_0_16917756"
           src="https://hst-api.wialon.com/avl_library_image/5/0/library/unit/A_11.png?b=16&amp;v=1&amp;sid=09b694edc6d76332da3bbc20210f9aa0"
           style="cursor:pointer;">
     </td>

     <td class="monitoring-unit-name"
         @click="objectSelect(object.id, object.selected = true), moveTo(object)"
     >
      {{object.name}}
     </td>

     <td><input type="checkbox" :disabled="!object.selected"
                @click="watchDevice(object ,object.id, object.monitor = !object.monitor)"
     ></td>

     <td class="text-center">
      <div class="monitoring_units_state_move">
       <span class="icon-device" v-bind:class="{'green-color': object.geo.speed}"></span>
      </div>
     </td>

     <td class="text-center">
      <div class="icon-remove" @click="removeObject(object)">&times;</div>
     </td>

    </tr>
    </tbody>
   </table>
  </div>
 </div>
</template>

<script>
 import {mapActions, mapGetters, mapState} from "vuex";

 export default {
  name: "monitoringList",
  data() {
   return {
    map: null,
    isActive: true,
    search: '',
    timer: null
   }
  },
  computed: {
   ...mapGetters({
    objects: 'getObjects',
    selectedObjects: 'getSelectedObjects',
    selectedImei: 'getSelectedObjectsImei',
    getMonitor: 'getMonitorObjects',
   }),
   filtered() {
    let grobjects = Object.filter(this.objects, obj => (this.objects[obj.id]));
    let result = Object.filter(
     grobjects, obj => obj.name.toLowerCase().indexOf(this.search.toLowerCase()) != -1 ||
      obj.imei.toLowerCase().indexOf(this.search.toLowerCase()) != -1 ||
      obj.reg_number.toLowerCase().indexOf(this.search.toLowerCase()) != -1
    );
    return result
   }
  },
  methods: {
   ...mapActions([
    'selectObject',
    'selectAllObject',
    'monitorObject'
   ]),


   objectSelect(id, value) {
    this.selectObject({id, value})
   },
   selectAllObject() {
    this.$store.dispatch('selectAllObject', event.target.checked)
   },

   ...mapState('mapModule', ['mapInstance']),

   moveTo(object) {
    this.mapInstance().flyTo([object.geo.latitude, object.geo.longitude], 8, {animate: true})
   },

   removeObject(object) {
    console.log(object)
   },

   watchDevice(object, id, value) {
    this.monitorObject({id, value})
   },

   mounted() {
   }

  }

 }
</script>

<style scoped>

 .monitoring_filter {
  width: 100% !important;
 }

 .size_16 {
  height: 16px;
 }

 .icon-remove {
  color: red;
  font-size: 18px;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
 }

 .table td, .table th {
  padding: 0;
  border: none;
  vertical-align: middle;
 }

 tr {
  border-bottom: 1px solid #d0cecf;
 }

 ul {
  padding: 0;
  margin: 0;
 }

 li {
  border: 1px solid #cccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .2rem;
  margin-bottom: .1rem;
 }

 .rm {
  background-color: red;
  color: #fff;
  border: none;

 }


 .monitoring_panel_filter {
  width: 100%;
  margin-bottom: 10px;
  padding: 0 5px;
 }

 .monitoring-unit-name {
  cursor: pointer;
 }

 .monitoring_panel {
  display: flex;
  width: 40px;
  justify-content: space-between;
 }

 .icon-device {
  background-color: #979797;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: block;
 }

 .green-color {
  background-color: green;
 }

</style>