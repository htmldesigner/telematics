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

   <template>
    <div class="d-inline-block ml-2">
     <Checkbox v-model="checked" :binary="true" @click="expand"/>
    </div>

    <div class="d-inline-block" v-on:click="$emit('component-link', 'monitoringList')">
     <img :src="icon.group" alt="Alt">
    </div>
   </template>

   <Column field="name" :expander="true" filterMatchMode="contains">
    <template #body="slotProps">
     <img v-if="!slotProps.node.data.objects" class="mr-1"
          src="https://hst-api.wialon.com/avl_library_image/5/0/library/unit/A_11.png?b=16&amp;v=1&amp;sid=09b694edc6d76332da3bbc20210f9aa0"
          alt="Alt">
     {{ slotProps.name }}
    </template>
   </Column>

   <Column headerStyle="display:none" bodyStyle="text-align: right; width: 80px">
    <template #body="slotProps">
     <div class="d-flex justify-content-end" v-if="!slotProps.node.data.objects">
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

 export default {
  name: "monitoringGroup",
  data() {
   return {
    filter: '',
    icon: {
     stop: '/img/stop-stroke.svg',
     move: '/img/start.svg',
     watch: '/img/watch-green.svg',
     notWatch: '/img/watch-grey.svg',
     list: '/img/list.svg',
     group: '/img/group.svg'
    },

    filters: {},
    root: [],
    selectedKeys: null,
    expandedKeys: {},
    checked: false,
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    objects: 'getObjects',
    objectsgroups: 'getObjectsGroups',
   })
  },
  methods: {

   ...mapActions([
    'selectObject',
    'selectAllObject',
    'monitorObject',
    'selectObjectGroup'
   ]),

   result(group) {
    let keyFirst = 0
    let keySecond = 0
    for (let i in group) {
     let grobjects = Object.filter(this.objects, obj => (group[i].objects.includes(obj.id)));
     let createArray = {
      "key": 0 + '-' + keyFirst++,
      "data": group[i],
      "children": []
     }
     if (grobjects) {
      for (let i in grobjects) {
       createArray.children.push({data: grobjects[i], key: keySecond++ + '-' + keyFirst++})
      }
     }
     this.root.push(createArray)
    }
   },

   expand() {
    if (!this.checked) {
     this.expandAll()
    } else {
     this.collapseAll()
    }
   },

   expandAll() {
    for (let node of this.root) {
     this.expandNode(node);
    }
    this.expandedKeys = {...this.expandedKeys};
   },

   collapseAll() {
    this.expandedKeys = {};
   },

   expandNode(node) {
    if (node.children && node.children.length) {
     this.expandedKeys[node.key] = true;
     for (let child of node.children) {
      this.expandNode(child);
     }
    }
   },

   onNodeSelect(element) {
    let item = element.data
    if (element.data.objects) {
     this.selectObjectGroup({id:element.data.id, value: true})
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
    let item = element.data
    if (element.data.objects) {
     this.selectObjectGroup({id:element.data.id, value: false})
    } else {
     if (item.geo) {
      this.selectObject({id: item.id, value: false})
     } else {
      this.$store.dispatch('setError', 'У данного объекта отсутствуют координаты').then(() => {
       this.$store.dispatch('clearError')
      })
     }
    }
   },

   flyToGroup(){
    for(let i in this.objects){
     if (this.objects[i].selected){
      if (this.objects[i].geo){
       this.mapInstance.flyTo([this.objects[i].geo.latitude, this.objects[i].geo.longitude])
      }else {
       this.$store.dispatch('setError', 'У объекта ' + this.objects[i].name +' отсутствуют координаты').then(() => {
        this.$store.dispatch('clearError')
       })
      }
     }
    }
   },

   watchDevice(id, value) {
    this.monitorObject({id, value})
   },

  },
  mounted() {
   this.result(this.objectsgroups)
   this.expandedKeys[this.root[0].key] = true;
  }
 }
</script>

<style scoped>
 .p-treetable-toggler {
  margin-left: 0 !important;
 }
</style>