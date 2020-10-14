<template>
 <div class="modalObjectLoader">

  <div class="object-loader-modal-header">
   <span class="close" @click="$emit('close')">x</span>
  </div>

  <div class="modalObjectLoader-container mt-3">
   <TabView>

    <TabPanel header="Объекты">

     <form @submit.prevent="objectSearch">
      <div class="form-group mt-2 mb-1">
       <div class="input-group search">
        <input
         type="text"
         autocomplete="off"
         v-model="filter"
         class="form-control form-control-custom"
         id="exampleInputSearch"
         placeholder="Поиск и выбор объектов">

        <span class="input-group-btn">
         <button type="submit">Поиск</button>
        </span>
       </div>
       <small class="form-text text-danger search-helper">Для загрузки всего списка нажать поик с пустым полем</small>
      </div>
     </form>

     <TreeTable v-if="items.length"
      class="treeTable-custom"
      :value="items"
      :paginator="true"
      :rows="totalRows"
      @page="onPageList($event)"
     >
      <Column>
       <template #body="slotProps">
        <div class="list-element" style="display: flex; justify-content: space-between">
         <div>{{slotProps.node.data.name}}</div>
         <button class="btn-custom-outline-small" title="Добавить" @click="addtoworkset(slotProps.node.data.id)">
          <span>+</span>
         </button>
        </div>
       </template>
      </Column>
     </TreeTable>
     <div v-else>
      Объект не найден
     </div>
    </TabPanel>

    <TabPanel header="Группы объектов">

     <form @submit.prevent="groupSearch">
      <div class="form-group mt-2 mb-1">
       <div class="input-group search">
        <input
         type="text"
         v-model="groupFilter"
         class="form-control form-control-custom"
         placeholder="Поиск и выбор групп">
        <span class="input-group-btn">
         <button type="submit">Поиск</button>
        </span>
       </div>
       <small class="form-text text-danger search-helper">Для загрузки всего списка нажать поик с пустым полем</small>
      </div>
     </form>

     <TreeTable v-if="groupItems.length"
      class="treeTable-custom"
      :value="groupItems"
      :paginator="true"
      :rows="groupTotalRows"
      @page="onPageGroup($event)"
     >
      <Column>
       <template #body="slotProps">
        <div class="list-element" style="display: flex; justify-content: space-between">
         <div>{{slotProps.node.data.name}}</div>
         <button class="btn-custom-outline-small" title="Добавить" @click="addgrouptoworkset(slotProps.node.data.id)">
          <span>+</span>
         </button>
        </div>
       </template>
      </Column>
     </TreeTable>
     <div v-else>
      Группа не найдена
     </div>
    </TabPanel>

   </TabView>
  </div>


 </div>
</template>

<script>
 import api from "../../app/api";
 import {mapGetters, mapActions, mapMutations} from 'vuex'

 export default {
  name: "modalObjectLoader",
  data() {
   return {
    perPage: 20,

    filter: "",
    currentPage: 0,
    totalRows: 20,
    isBusy: false,
    items: [],

    groupItems: [],
    groupFilter: "",
    groupCurrentPage: 0,
    groupTotalRows: 20,
    isGroupBusy: false,
   }
  },
  computed: {
   ...mapGetters({
    objects: 'getObjects',
   })
  },

  watch: {
   objects: {
    handler() {
     this.objectListProvider()
    },
   },
  },

  methods: {
   ...mapActions(['addToWorkSet', 'addGroupToWorkSet']), //,'listObjects','listGroups'

   async objectListProvider() {
    try {
     const response = await api.listObjects({filter: this.filter, size: this.perPage, page: this.currentPage = 0})
     this.isBusy = false
     let items = response.data.data.objects
     let createItemsArr = []
     for (let i in items) {
      let node = {
       key: items[i].id,
       data: items[i],
      };
      createItemsArr.push(node)
     }
     this.items = Array.from(new Set(createItemsArr))
    } catch (error) {
     console.log(error);
    }
   },

   async groupListProvider() {
    this.isGroupBusy = true
    try {
     const response = await api.listGroups({
      filter: this.groupFilter,
      size: this.perPage,
      page: this.groupCurrentPage = 0
     });
     this.isGroupBusy = false
     let groupItems = response.data.data.groups
     let createItemsArr = []
     for (let i in groupItems) {
      let node = {
       key: groupItems[i].id,
       data: groupItems[i],
      };
      createItemsArr.push(node)
     }
     this.groupItems = Array.from(new Set(createItemsArr))
    } catch (error) {
     console.log(error);
    }
   },


   onPageList(event) {
    this.currentPage = event.page
    this.objectListProvider()
   },

   onPageGroup(event) {
    this.currentPage = event.page
    this.groupListProvider()
   },

   async addtoworkset(id) {
    await this.$store.dispatch('addToWorkSet', [id])
    await this.$store.dispatch('loadObjects')
    await this.objectListProvider()
   },

   async addgrouptoworkset(id) {
    await this.$store.dispatch('addGroupToWorkSet', [id])
    await this.$store.dispatch('loadObjects')
    await this.groupListProvider()
   },

   objectSearch(){
    this.objectListProvider()
    this.filter = ''
   },

   groupSearch(){
    this.groupListProvider()
    this.groupFilter = ''
   }

  },

  mounted() {
   this.objectListProvider()
   this.groupListProvider()
  }

 }
</script>
<style scoped>

</style>