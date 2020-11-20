<template>
 <div class="modalObjectLoader">

  <div class="object-loader-modal-header">
   <span class="close" @click="$emit('close')">x</span>
  </div>
  <div class="modalObjectLoader-container mt-3">

   <TabView>
    <TabPanel header="Гоезоны">
     <form @submit.prevent="objectSearch">
      <div class="form-group mt-2 mb-1">
       <div class="input-group search">
        <input
         type="text"
         autocomplete="off"
         v-model="filter"
         class="form-control form-control-custom"
         id="exampleInputSearch"
         placeholder="Поиск и выбор геозон">
        <span class="input-group-btn">
         <button type="submit">Поиск</button>
        </span>
       </div>
       <small class="form-text text-danger search-helper">Для загрузки всего списка нажать поик с пустым полем</small>
      </div>
     </form>

     <div class="pagination-wrap">
     <div class="pagination-items-block">
      <div class="pagination-items-list" v-for="object in objects" :key="object.id">
       <div class="pagination-items" @click="addtoworkset(object.id)">{{object.name}}
        <button v-tooltip="'Добавить в рабочее поле'" class="btn-custom-outline-ultra-small"  @click="addtoworkset(object.id)">+</button>
       </div>
      </div>
     </div>

     <pagination
      :current="currentPage"
      @page-changed="geoZoneListProvider"
      :total="totalObjects"
      :perPage="perPage"
     ></pagination>
     </div>

    </TabPanel>

    <TabPanel header="Группы геозон">

     <form @submit.prevent="groupSearch">
      <div class="form-group mt-2 mb-1">
       <div class="input-group search">
        <input
         type="text"
         v-model="groupFilter"
         class="form-control form-control-custom"
         placeholder="Поиск и выбор групп геозон">
        <span class="input-group-btn">
         <button type="submit">Поиск</button>
        </span>
       </div>
       <small class="form-text text-danger search-helper">Для загрузки всего списка нажать поик с пустым полем</small>
      </div>
     </form>

     <div class="pagination-wrap">
      <div class="pagination-items-block">
       <div class="pagination-items-list" v-for="group in groups" :key="group.id">
        <div class="pagination-items" @click="addgrouptoworkset(group.id)">{{group.name}}
         <button v-tooltip="'Добавить в рабочее поле'" class="btn-custom-outline-ultra-small"  @click="addgrouptoworkset(group.id)">+</button>
        </div>
       </div>
      </div>

      <pagination
       :current="groupCurrentPage"
       @page-changed="groupListProvider"
       :total="totalGroups"
       :perPage="perPage"
      ></pagination>
     </div>

    </TabPanel>
   </TabView>
  </div>


 </div>
</template>

<script>
 import api from "../../app/api";
 import {mapGetters, mapActions, mapMutations} from 'vuex'
 import pagination from "./pagination";

 export default {
  name: "modalObjectLoader",
  components: {
   pagination
  },
  data() {
   return {
    objects: [],
    totalObjects: 0,
    currentPage: 1,
    filter: "",

    perPage: 25,

    groups: [],
    totalGroups: 0,
    groupFilter: "",
    groupCurrentPage: 1,
   }
  },

  methods: {
   // ...mapActions(['addToWorkSet', 'addGroupToWorkSet']),
   ...mapActions(['addGeoZoneToWorkSet', 'addGroupGeoZoneToWorkSet']),
   async geoZoneListProvider(page) {
    try {
     let options = {filter: this.filter, size: this.perPage, page: page}
     const response = await api.listGeozones(options)
     this.objects = response.data.data.geozones
     this.totalObjects = parseInt(response.data.data.count)
     this.currentPage = page
    } catch (error) {
     throw error
    }
   },

   async groupListProvider(page) {
    try {
     let options = {filter: this.groupFilter, size: this.perPage, page: page}
     const response = await api.listGeozoneGroups(options)
     this.groups = response.data.data.groups
     this.totalGroups = parseInt(response.data.data.count)
     this.groupCurrentPage = page
    } catch (error) {
     throw error
    }
   },

   async addtoworkset(id) {
    await this.$store.dispatch('addGeoZoneToWorkSet', [id])
    await this.$store.dispatch('loadGeozones')
    this.objects = this.objects.filter(el => el.id !== id)
   },

   async addgrouptoworkset(id) {
    await this.$store.dispatch('addGroupGeoZoneToWorkSet', [id])
    await this.$store.dispatch('loadGeozones')
    this.groups = this.groups.filter(el => el.id !== id)
   },

   objectSearch() {
    this.geoZoneListProvider()
    this.filter = ''
   },

   groupSearch() {
    this.groupListProvider()
    this.groupFilter = ''
   }
  },

  created() {
   this.geoZoneListProvider()
   this.groupListProvider()
  }

 }
</script>
<style scoped>

</style>