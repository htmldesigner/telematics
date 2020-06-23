<template>
 <div>
  <div class="monitoring_list" v-on:click="$emit('component-link', 'monitoringList')">
   <img class="size_16" src="/img/list.png" alt="Alt">
  </div>
  <input type="text" class="form-control" v-model="filter" aria-describedby="button-addon4" placeholder="Введите название, IMEI, регномер">

  <div style="padding:10px;">
   <div v-for="(group,index) in objectsgroups" :key="index">
    <label>
     <input type="checkbox"/>
     {{ group.name }}
    </label>
    <ul style="padding-left: 20px;list-style: none;">
     <li v-for="objectId in filteredObjects(group)" :key="objectId">
      <label>
       asas
       <input type="checkbox"/>


       {{ objects[objectId].name }}
      </label>
     </li>
    </ul>
   </div>
  </div>

 </div>
</template>

<script>
 import {mapGetters} from "vuex";

 export default {
  name: "monitoringGroup",
  data(){
   return {
    filter: ''
   }
  },
  computed: {
   ...mapGetters({
   objects: 'getObjects',
   objectsgroups: 'getObjectsGroups',
  })
  },
  methods: {
   filteredObjects(group) {
    if (this.filter == null) {
     this.filter = "";
    }
    let grobjects = Object.filter(this.objects, obj => (group.objects.includes(obj.id)));
    let g2 = Object.filter(grobjects, obj => obj.name.toLowerCase().includes(this.filter.toLowerCase()) ||
     obj.imei.toLowerCase().includes(this.filter.toLowerCase()) ||
     obj.reg_number.toLowerCase().includes(this.filter.toLowerCase()));
    return Object.map(g2, _ => _.id);
   }
  }
 }
</script>

<style scoped>

</style>