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
    <InputText class="mb-2" v-model="filters['name']" placeholder="Поиск объектов" style="width: 100%; height: 35px"/>
   </template>


   <div class="d-flex justify-content-end">

    <!--    <div class="d-flex justify-content-start" style="width: 200px;">-->

    <!--     <div class="d-inline-block ml-2">-->
    <!--      <Checkbox v-model="checked" v-tooltip="'Раскрыть все группы'" :binary="true" @click="expand"/>-->
    <!--     </div>-->

    <!--     <div style="position: relative; top: -2px" v-tooltip="'Активные объекты'">-->
    <!--      <input type="checkbox"-->
    <!--             class="d-none"-->
    <!--             id="activeObjectSelector"-->
    <!--             @click="selectAll(activeObjectSelector = !activeObjectSelector)"-->
    <!--      >-->
    <!--      <label for="activeObjectSelector" class="m-0">-->
    <!--       <img v-if="activeObjectSelector && getSelectedObjects.length" :src="icon.watch" alt="Alt">-->
    <!--       <img v-else :src="icon.notWatch" alt="Alt">-->
    <!--      </label>-->
    <!--     </div>-->
    <!--    </div>-->

    <div class="d-inline-block modal-object-list-ico" v-tooltip="'Геозоны'" @click="$emit('modalGeoZoneList')">
     <img :src="icon.group" alt="Alt">
    </div>

   </div>


   <Column field="name" :expander="true" filterMatchMode="contains">
    <template #body="slotProps">
     {{slotProps.node.data.name}}
    </template>
   </Column>

   <Column headerStyle="display:none" bodyStyle="text-align: right; width: 100px">
    <template #body="slotProps">
     <div class="d-flex justify-content-end align-items-center" v-if="!slotProps.node.data.geozones">
             <span style="cursor: pointer; z-index: 300; position: relative;top: -2px;"
                   v-tooltip="'Убрать из спаска'"
                   @click="removeGeoZoneFromWorkSet([slotProps.node.data.id])">
        <img :src="icon.remove" alt="Alt">
       </span>
     </div>
     <div v-else>
        <span style="cursor: pointer; z-index: 300; position: relative;top: -2px;"
                 v-tooltip="'Убрать из спаска'"
                 @click="removeGroupGeoZoneFromWorkSet([slotProps.node.data.id])">
        <img :src="icon.remove" alt="Alt">
       </span>
     </div>

    </template>
   </Column>


   <Column v-if="userPermission" headerStyle="display:none" bodyStyle="text-align: right; width: 80px">
    <template #body="slotProps">
     <div v-if="!slotProps.node.data.geozones" class="d-flex">
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
 import {eventBus} from "../../eventBus";

 export default {
  name: "geozone",
  components: {},
  data() {
   return {
    userPermission: true,
    filters: {},
    selectedKeys: null,
    expandedKeys: {},
    value: '',
    currentGeozoneGroup: '',
    icon: {
     remove: require('@/assets/remove.svg'),
     pencil: require('@/assets/pencil.svg'),
     group: require('@/assets/group.svg'),
    },
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    geozones: 'getGeozones',
    geozonesgroups: 'getGeozonesGroups',
   }),
   root() {
    return this.$service.objectsArrayCreate(this.geozonesgroups, this.geozones)
   }
  },

  methods: {
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
    if (!node.data.geozones) {
     this.$store.dispatch('getSelectedGeozone', id)
    } else {
     this.$store.dispatch('getSelectedGeozoneGroup', id)
    }
   },
   onNodeUnselect(node) {
    if (node.data.geozones) {
     this.$store.dispatch('unselectGeozone', node.data.geozones)
    } else {
     this.$store.dispatch('unselectGeozone', node.data.id)
    }
   },


   async removeGeoZoneFromWorkSet(id) {
    console.log(id)
    await this.$store.dispatch('removeGeoZoneFromWorkSet', id)
    // await this.$store.dispatch('loadObjects')
   },

   async removeGroupGeoZoneFromWorkSet(id) {
    await this.$store.dispatch('removeGroupGeoZoneFromWorkSet', id)
    // await this.$store.dispatch('loadObjects')
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

  },
  async mounted() {
   this.userPermission = null // await this.$store.getters.getUserPermission
   this.detectPermission(this.userPermission)
   eventBus.$on('map-Clear', () => {
    this.selectedKeys = null
   });
  },
 }
</script>


<style scoped>

</style>