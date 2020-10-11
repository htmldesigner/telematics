<template>
 <div>

  <TreeTable
   :value="root"
   sortMode="single"
   selectionMode="checkbox"
   :filters="filters"
   :expandedKeys="expandedKeys"
   filterMode="lenient"
   :selectionKeys.sync="selectedKeys"
   @node-select="onNodeSelect"
   @node-unselect="onNodeUnselect"
  >
   <template>
    <InputText class="mb-3" v-model="filters['name']" placeholder="Введите название, IMEI, регномер"
               style="width: 100%; height: 35px"/>
   </template>

   <div class="monitoring_panel">
    <div class="monitoring_list" v-on:click="$emit('component-link', 'monitoringGroup')">
     <img :src="icon.list" alt="Alt">
    </div>
   </div>

   <Column field="name" :expander="true" filterMatchMode="contains">
    <template #body="slotProps">
     <img v-if="!slotProps.node.data.parent" class="mr-1"
          src="https://hst-api.wialon.com/avl_library_image/5/0/library/unit/A_11.png?b=16&amp;v=1&amp;sid=09b694edc6d76332da3bbc20210f9aa0"
          alt="Alt">
     {{ slotProps.node.data.name }}
    </template>
   </Column>

   <Column headerStyle="display:none" bodyStyle="text-align: right; width: 80px">
    <template #body="slotProps">
     <div class="d-flex justify-content-end" v-if="!slotProps.node.data.parent">

      <div class="icon-watch mx-1" title="Следить за объектом на карте">
       <input type="checkbox"
              class="d-none"
              :disabled="!slotProps.node.data.selected"
              :id="`${slotProps.node.key}`"
              @click="watchDevice(slotProps.node.data.id, slotProps.node.data.monitor = !slotProps.node.data.monitor)"
       >
       <label :for="`${slotProps.node.key}`" class="m-0">
        <img v-if="slotProps.node.data.monitor && slotProps.node.data.selected" :src="icon.watch" alt="Alt">
        <img v-else :src="icon.notWatch" alt="Alt">
       </label>
      </div>

      <div class="mx-1">
       <span class="icon-device">
        <img v-if="slotProps.node.data.geo && slotProps.node.data.geo.speed" :src="icon.move" alt="Alt" class="">
        <img v-else :src="icon.stop" alt="Alt" class="">
       </span>
      </div>

     </div>
    </template>
   </Column>
  </TreeTable>


 </div>
</template>

<script>
 import {mapActions, mapGetters, mapState} from "vuex";
 import {eventBus} from "../../eventBus";

 export default {
  name: "monitoringList",

  data() {
   return {
    selectedKeys: null,
    expandedKeys: {},
    root: [],
    filters: {},
    icon: {
     stop: '/img/stop-stroke.svg',
     move: '/img/start.svg',
     watch: '/img/watch-green.svg',
     notWatch: '/img/watch-grey.svg',
     list: '/img/list.svg',
     group: '/img/group.svg'
    }
   }
  },

  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    objects: 'getObjects',
    selectedObjects: 'getSelectedObjects',
    selectedImei: 'getSelectedObjectsImei',
    getMonitor: 'getMonitorObjects',
   }),
   // filtered() {
   //  let grobjects = Object.filter(this.objects, obj => (this.objects[obj.id]));
   //  let result = Object.filter(
   //   grobjects, obj => obj.name.toLowerCase().indexOf(this.filter.toLowerCase()) != -1 ||
   //    obj.imei.toLowerCase().indexOf(this.filter.toLowerCase()) != -1 ||
   //    obj.reg_number.toLowerCase().indexOf(this.filter.toLowerCase()) != -1
   //  );
   //  return result
   // }
  }
  ,
  methods: {
   ...mapActions([
    'selectObject',
    'selectAllObject',
    'monitorObject'
   ]),

   onNodeSelect(element) {
    let item = element.data
    if (element.data.parent) {
     this.selectAllObject(true)
     this.flyToGroup(element)
    } else {
     if (item.geo) {
      this.selectObject({id: item.id, value: true})
      this.mapInstance.flyTo([item.geo.latitude, item.geo.longitude])
     } else {
      this.$store.dispatch('setError', 'У данного объекта отсутствуют координаты').then(() => {
       this.$store.dispatch('clearError')
      })
     }
    }
   },

   onNodeUnselect(element) {
    if (element.data.parent) {
     this.selectAllObject(false)
    } else {
     this.selectObject({id: element.data.id, value: false})
     // if (item.geo) {
     //  this.selectObject({id: item.id, value: false})
     // } else {
     //  this.$store.dispatch('setError', 'У данного объекта отсутствуют координаты').then(() => {
     //   this.$store.dispatch('clearError')
     //  })
     // }
    }
   },

   flyToGroup() {
    for (let i in this.objects) {
     if (this.objects[i].selected) {
      if (this.objects[i].geo) {
       this.mapInstance.flyTo([this.objects[i].geo.latitude, this.objects[i].geo.longitude])
      } else {
       this.$store.dispatch('setError', 'У объекта ' + this.objects[i].name + ' отсутствуют координаты').then(() => {
        this.$store.dispatch('clearError')
       })
      }
     }
    }
   },

   watchDevice(object, id, value) {
    this.monitorObject({id, value})
   },

   result(obj) {
    let keyFirst = 1
    let createArray = {
     "key": '0-0',
     "data": {parent: true},
     "children": []
    }
    for (let i in obj) {
     createArray.children.push({data: obj[i], key: 0 + '-' + keyFirst++})
    }
    this.root.push(createArray)
   }

  },
  mounted() {
   setTimeout(() => {
    this.result(this.objects)
    this.expandedKeys[this.root[0].key] = true;
   }, 400)
   eventBus.$on('map-Clear', () => {
    this.selectedKeys = null
   });
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

 /*.icon-device {*/
 /* background-color: #979797;*/
 /* width: 18px;*/
 /* height: 18px;*/
 /* border-radius: 50%;*/
 /* display: block;*/
 /*}*/

 .green-color {
  background-color: green;
 }

 /*.icon-watch label:before{*/
 /* content: 'Новьё';*/
 /* width: 10px;*/
 /* height: 10px;*/
 /* background-color: red;*/
 /*}*/


</style>