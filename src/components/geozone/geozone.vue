<template>
 <div class="geozone-container mt-3 px-2">

  <div class="drow" v-if="userPermission">
   <div class="notice-block border mb-3 p-3">
    <p>Необходимо выбрать группу, куда будут добавлены геозоны.</p>
    <p>Название геозоны устанавливается кликом по рисунку.</p>
   </div>

   <select class="form-control mr-1 mb-3" v-model="currentGeozoneGroup">
    <option v-for="(geozone, index) in root" :key="index" :value="geozone.data.id">
     {{geozone.data.name}}
    </option>
   </select>
   <div class="row mb-3">
    <div class="col d-flex justify-content-center">
     <button @click="drawShow" class="btn button btn-success mx-1 px-3 py-1">Добавить</button>
     <button @click="drawHide" class="btn btn-info mx-1 px-3 py-1">Завершить</button>
     <button @click="drawSave" type="button" class="btn-custom mx-1 px-3 py-1">
      <span>Сохранить</span>
     </button>
    </div>
   </div>
   <hr>
  </div>

  <TreeTable
   class="treetable-custom-control"
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
    <InputText class="mb-3" v-model="filters['name']" placeholder="Поиск объектов" style="width: 100%; height: 35px"/>
   </template>

   <Column field="name" :expander="true" filterMatchMode="contains">
    <template #body="slotProps">
     {{slotProps.node.data.name}}
    </template>
   </Column>

   <Column v-if="userPermission" headerStyle="display:none" bodyStyle="text-align: right; width: 80px">
    <template #body="slotProps">
     <div v-if="!slotProps.node.data.objects" class="d-flex">
      <button class="btn-custom-outline-small mx-1" title="Редактировать"
              @click.once="editGeozone(slotProps.node.data.id)">
       <img :src="icon.pencil" alt="Alt">
      </button>
      <button class="btn-custom-outline-small mx-1" title="Удалить">
       <img :src="icon.remove" alt="Alt">
      </button>
     </div>
    </template>
   </Column>

  </TreeTable>
 </div>

</template>

<script>
 import {mapGetters, mapActions, mapMutations, mapState} from 'vuex'
 import api from "@/app/api"
 import {eventBus} from "../../eventBus";

 export default {
  name: "geozone",
  components: {},
  data() {
   return {
    userPermission: true,
    filters: {},
    root: [],
    selectedKeys: null,
    expandedKeys: {},
    value: '',

    currentGeozoneGroup: '',

    icon: {
     remove: '/img/remove.svg',
     pencil: '/img/pencil.svg'
    },

   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    geozones: 'getGeozones',
    geozonesgroups: 'getGeozonesGroups',
   }),
  },

  methods: {

   result(group, geozone) {
    for (let i in group) {
     let keyFirst = group[i].id
     let grobjects = Object.values(geozone).filter(el => {return group[i].objects.includes(el.id)})
     let createArray = {
      "key": 0 + '-' + keyFirst,
      "data": group[i],
      "children": []
     }
     if (grobjects) {
      for (let i in grobjects) {
       let keySecond = grobjects[i].id
       createArray.children.push({data: grobjects[i], key: keyFirst + '-' + keySecond})
      }
     }
     this.root.push(createArray)
    }
   },

   drawShow() {
    this.$emit("on-Action", "show");
   },
   drawHide() {
    this.$emit("on-Action", "hide");
   },
   // drawClear() {
   //  this.$emit("on-Action", "clear");
   // },
   drawSave() {
    this.$emit("on-Action", "save", this.currentGeozoneGroup);
   },

   editGeozone(id) {
    this.$store.dispatch('getModifiableGeozone', id)
   },

   onNodeSelect(node) {
    let id = node.data.id
    if (!node.data.objects) {
     this.$store.dispatch('getSelectedGeozone', id)
    } else {
     this.$store.dispatch('getSelectedGeozoneGroup', id)
    }
   },
   onNodeUnselect(node) {
    if (node.data.objects) {
     this.$store.dispatch('unselectGeozone', node.data.objects)
    } else {
     this.$store.dispatch('unselectGeozone', node.data.id)
    }

   },

   detectPermission(permission) {
    if (permission) {
     permission.forEach(el => {
      if (el === 'resource.1.ResourceEditGeozones') {
       return this.userPermission = true
      } else {
       return this.userPermission = false
      }
     })
    }
   },

   onLoad() {
    this.result(this.geozonesgroups, this.geozones)
   }

  },
  async mounted() {
   this.userPermission = null // await this.$store.getters.getUserPermission
   this.detectPermission(this.userPermission)
   eventBus.$on('map-Clear', () => {
   this.selectedKeys = null
   });

  },
  created() {

  },


 }
</script>


<style scoped>

</style>