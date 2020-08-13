<template>
 <div>

  <!--  <input type="text" class="form-control mb-3" v-model="filter" aria-describedby="button-addon4"-->
  <!--         placeholder="Введите название, IMEI, регномер">-->


  <TreeTable
   :value="root"
   sortMode="single"
   selectionMode="checkbox"
   :filters="filters"
   :expandedKeys="expandedKeys"
   filterMode="lenient"
   :selectionKeys.sync="selectedKeys">

   <template>
    <InputText class="mb-3" v-model="filters['name']" placeholder="Введите название, IMEI, регномер" style="width: 100%; height: 35px"/>
   </template>

   <template>
<!--    <div class="d-inline-block ml-2">-->
<!--     <Checkbox v-model="checked" :binary="true" @click="expand"/>-->
<!--    </div>-->
    <div class="d-inline-block" v-on:click="$emit('component-link', 'monitoringList')">
     <img :src="icon.group" alt="Alt">
    </div>
   </template>

   <Column field="name" :expander="true" filterMatchMode="contains">
    <template #body="slotProps">
     <img v-if="!slotProps.node.data.objects" class="mr-1" src="https://hst-api.wialon.com/avl_library_image/5/0/library/unit/A_11.png?b=16&amp;v=1&amp;sid=09b694edc6d76332da3bbc20210f9aa0" alt="Alt">
     {{slotProps.name}}
    </template>
   </Column>

   <Column headerStyle="display:none" bodyStyle="text-align: right; width: 80px">
    <template #body="slotProps">
<div class="d-flex justify-content-end" v-if="!slotProps.node.data.objects">


 <div class="icon-watch mx-1" title="Следить за объектом на карте">
  <input type="checkbox"
         class="d-none"
         :id="`iconWatch`"
  >
  <label :for="`iconWatch`" class="m-0">
   <img v-if="1 < 0" :src="icon.watch" alt="Alt">
   <img v-else :src="icon.notWatch" alt="Alt">
  </label>
 </div>

 <div class="mx-1">
       <span class="icon-device">
        <img v-if="1 > 0" :src="icon.move" alt="Alt" class="" >
        <img v-else :src="icon.stop"  alt="Alt" class="">
       </span>
 </div>

</div>


    </template>
   </Column>


  </TreeTable>

  <!--  <div style="padding:10px;">-->
  <!--   <div v-for="(group,index) in objectsgroups" :key="index">-->
  <!--    <label>-->
  <!--     <input type="checkbox"/>-->
  <!--     {{ group.name }}-->
  <!--    </label>-->
  <!--    <ul style="padding-left: 20px;list-style: none;">-->
  <!--     <li v-for="objectId in filteredObjects(group)" :key="objectId">-->
  <!--      <label>-->
  <!--       <input type="checkbox"/>-->
  <!--       {{ objects[objectId].name }}-->
  <!--      </label>-->
  <!--     </li>-->
  <!--    </ul>-->
  <!--   </div>-->
  <!--  </div>-->

 </div>
</template>

<script>
 import {mapGetters} from "vuex";

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
   ...mapGetters({
    objects: 'getObjects',
    objectsgroups: 'getObjectsGroups',
   })
  },
  methods: {
   // filteredObjects(group) {
   //  if (this.filter == null) {
   //   this.filter = "";
   //  }
   //  let grobjects = Object.filter(this.objects, obj => (group.objects.includes(obj.id)));
   //  let g2 = Object.filter(grobjects, obj => obj.name.toLowerCase().includes(this.filter.toLowerCase()) ||
   //   obj.imei.toLowerCase().includes(this.filter.toLowerCase()) ||
   //   obj.reg_number.toLowerCase().includes(this.filter.toLowerCase()));
   //  return Object.map(g2, _ => _.id);
   // },

   result(group) {
    for (let i in group) {
     let grobjects = Object.filter(this.objects, obj => (group[i].objects.includes(obj.id)));
     // console.log(grobjects)
     let createArray = {
      "key": i,
      "data": group[i],
      "children": []
     }
     if (grobjects) {
      for (let i in grobjects) {
       createArray.children.push({data: grobjects[i], key: i})
      }
     }
     this.root.push(createArray)
    }
    console.log(this.root)
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
   }

  },
  mounted() {
   this.result(this.objectsgroups)

   this.expandedKeys[this.root[0].key] = true;
  }
 }
</script>

<style scoped>
.p-treetable-toggler{
 margin-left: 0!important;
}
</style>