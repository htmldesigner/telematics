<template>
 <div class="monitoring-container mt-3 px-2">

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
    <InputText class="mb-2" v-model="filters['name']" placeholder="Введите название, IMEI, регномер"/>
   </template>

   <div class="d-flex justify-content-between">

    <div class="d-flex justify-content-start" style="width: 200px;">

     <div class="d-inline-block ml-2">
      <Checkbox v-model="checked" v-tooltip="'Раскрыть все группы'" :binary="true" @click="expand"/>
     </div>

     <div style="position: relative; top: -2px" v-tooltip="'Активные объекты'">
      <input type="checkbox"
             class="d-none"
             id="activeObjectSelector"
             @click="selectAll(activeObjectSelector = !activeObjectSelector)"
      >
      <label for="activeObjectSelector" class="m-0">
       <img v-if="activeObjectSelector && getSelectedObjects.length" :src="icon.watch" alt="Alt">
       <img v-else :src="icon.notWatch" alt="Alt">
      </label>
     </div>
    </div>

    <div class="d-inline-block modal-object-list-ico" v-tooltip="'Объекты'" @click="$emit('modalObjectList')">
     <img :src="icon.group" alt="Alt">
    </div>

   </div>

   <Column field="name" :expander="true" filterMatchMode="contains">
    <template #body="slotProps">
     <img v-if="!slotProps.node.data.objects" class="mr-1"
          src="https://hst-api.wialon.com/avl_library_image/5/0/library/unit/A_11.png?b=16&amp;v=1&amp;sid=09b694edc6d76332da3bbc20210f9aa0"
          alt="Alt">
     <span
      v-tooltip.objects="slotProps.node.data"
      :class="`${slotProps.node.data.objects ? 'parent' : 'children'}`">{{ slotProps.node.data.name }}
     </span>
    </template>
   </Column>

   <Column headerStyle="display:none" bodyStyle="text-align: right; width: 100px">
    <template #body="slotProps">
     <div class="d-flex justify-content-end align-items-center" v-if="!slotProps.node.data.objects">
      <div class="icon-watch mx-1" v-tooltip="'Следить за объектом на карте'" style="position: relative;top: -2px;">
       <input type="checkbox"
              class="d-none"
              :disabled="!slotProps.node.data.selected"
              :id="`${slotProps.node.key}`"
              @click="slotProps.node.data.monitor = !slotProps.node.data.monitor"
       >
       <label :for="`${slotProps.node.key}`" class="m-0">
        <img v-if="slotProps.node.data.monitor && slotProps.node.data.selected" :src="icon.watch" alt="Alt">
        <img v-else :src="icon.notWatch" alt="Alt">
       </label>
      </div>


      <div class="mx-1" style="position: relative;top: -3px;">
       <span class="icon-device" v-tooltip="'Трек за три часа'">
        <img :src="icon.track" alt="Alt">
       </span>
      </div>


      <div class="mx-1" style="position: relative;top: -3px;">
       <span class="icon-device" v-tooltip="'Последнее состояние: '+ statusClassText(slotProps.node) +' '">
        <img :src="statusClass(slotProps.node)" alt="Alt">
       </span>
      </div>

      <!--      <div :class="statusColor(slotProps.node)"></div>-->

      <div>
       <span style="cursor: pointer; z-index: 300; position: relative;top: -2px;"
             v-tooltip="'Убрать из спаска'"
             @click="removeFromWorkSet([slotProps.node.data.id])">
        <img :src="icon.remove" alt="">
       </span>
      </div>
     </div>

     <div v-else>
      <span style="cursor: pointer; z-index: 9999;"
            v-tooltip="'Убрать из спаска'"
            @click="removeGroupFromWorkSet([slotProps.node.data.id])">
       <img :src="icon.remove" alt="">
      </span>
     </div>

    </template>
   </Column>
  </TreeTable>
 </div>
</template>

<script>
 import {mapActions, mapGetters, mapState} from "vuex";
 import {eventBus} from "../../eventBus";
 import moment from 'moment'

 export default {
  name: "monitoring",
  data() {
   return {
    filter: '',
    icon: {
     stop: require('@/assets/stops.svg'),
     stopFull: require('@/assets/stops-off.svg'),
     stopNoContact: require('@/assets/NoContact.svg'),
     pending: require('@/assets/stop-full.svg'),
     move: require('@/assets/start.svg'),
     watch: require('@/assets/watch-green.svg'),
     notWatch: require('@/assets/watch-grey.svg'),
     list: require('@/assets/list.svg'),
     group: require('@/assets/group.svg'),
     remove: require('@/assets/remove.svg'),
     track: require('@/assets/zig-zag.svg')
    },

    filters: {},
    selectedKeys: null,
    expandedKeys: {},
    checked: false,
    activeObjectSelector: null,
    interval: null,
    root: null
   }
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    objects: 'getObjects',
    objectsgroups: 'getObjectsGroups',
    getSelectedObjects: 'getSelectedObjects',
    getMonitor: 'getMonitorObjects',
   }),
  },

  watch: {
   getMonitor: {
    handler(object) {
     this.monitorObjects(object)
     this.moveTo(object)
    },
    deep: true
   },
   objects: {
    handler(objects){
     this.watchingObjects(objects)
    },
    deep: true
   },
   objectsgroups: {
    handler(groups){
     this.watchingObjects(groups)
    }
   }
  },
  methods: {
      ...mapActions([
    'monitorObject',
    'selectObject',
    'selectObjectGroup',
    'getObjectsLastPosition'
   ]),

   watchingObjects(groups, objects){
    this.root = this.$service.objectsArrayCreate(groups = this.objectsgroups, objects = this.objects);
   },

   statusClass(object) {
    if (object.data.geo) {
     let now = moment(new Date()) //todays
     let end = moment(object.data.geo.fix_date) // another date
     let duration = moment.duration(now.diff(end))
     let diffTime = duration.asMinutes()

     if (diffTime > 10) {
      // 'red'
      return this.icon.stopFull
     } else if (diffTime < 5) {
      // 'green'
      if (object.data.geo.speed > 0) {
       return this.icon.move
      } else {
       return this.icon.stop
      }

     } else {
      // 'yellow'
      return this.icon.pending
     }
    } else {
     return this.icon.stopNoContact
    }
   },

   statusColor(object) {
    if (object.data.geo) {
     let now = moment(new Date()) //todays
     let end = moment(object.data.geo.fix_date) // another date
     let duration = moment.duration(now.diff(end))
     let diffTime = duration.asMinutes()
     if (diffTime > 10) {
      return 'red'
     } else if (diffTime < 5) {
      return 'green'
     } else {
      return 'yellow'
     }
    } else {
     return 'red'
    }
   },

   statusClassText(object) {
    let online = "";
    let onway = "";
    if (object.data.geo) {
     let now = moment(new Date()) //todays
     let end = moment(object.data.geo.fix_date) // another date
     let diffTime = moment.duration(now.diff(end))

     if (diffTime.asMinutes() < 5) {
      online = 'На связи'
      onway = object.data.geo.speed > 0 ? "(едет)" : "(стоит)";
     }
     // By day
     else if (diffTime.asHours() > 24) {
      online = 'Стоит (более ' + Math.round(diffTime.asDays()) + ' дн.' + ')'
     }
     // By hours
     else if (diffTime.asMinutes() > 60) {
      online = 'Стоит (более ' + Math.round(diffTime.asHours()) + ' ч. ' + Math.round(diffTime.asMinutes()) + 'мин.' + ')'
     }
     // By minutes
     else if (diffTime.asMinutes() < 60) {
      online = 'Стоит (более ' + Math.round(diffTime.asMinutes()) + ' мин. ' + Math.round(diffTime.asSeconds()) + 'сек.' + ')'
     }
    } else {
     online = "Отсутствуют данные о местонахождении";
    }
    return online + onway
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

   selectAll(toggler) {
    if (toggler) {
     for (let i in this.objects) {
      if (this.objects[i].hasOwnProperty('geo'))
       this.selectObject({id: this.objects[i].id, value: true})
     }

     for (let i in this.objectsgroups) {
      if (this.objectsgroups[i].objects.length) {
       this.selectObjectGroup({id: this.objectsgroups[i].id, value: true})
      }
     }

     let result = {}

     for (let group of this.root) {
      if (group.children.length) {
       for (let odj of group.children) {
        if (odj.data.hasOwnProperty('geo')) {
         result[odj.key] = {checked: true, partialChecked: false}
        }
       }
       let countChildren = group.children.filter(el => {
        return el.data.selected
       })

       if (countChildren.length === group.children.length) {
        result[group.key] = {checked: true, partialChecked: false}
       } else if (countChildren.length > 0) {
        result[group.key] = {checked: false, partialChecked: true}
       }
      }
     }
     this.selectedKeys = result
     this.flyToGroup()
    } else {
     for (let i in this.objects) {
      if (this.objects[i])
       this.selectObject({id: this.objects[i].id, value: false})
     }
     for (let i in this.objectsgroups) {
      if (this.objectsgroups[i].objects.length) {
       this.selectObjectGroup({id: this.objectsgroups[i].id, value: false})
      }
     }
     this.selectedKeys = {}
    }

   },

   onNodeSelect(element) {
    let item = element.data
    if (element.data.objects) {
     this.selectObjectGroup({id: element.data.id, value: true})
     this.getObjectsLastPosition({groupId: element.data.id})
     let arrForFlyGroup = element.children.map(el => el.data.device_id)
     this.flyToGroup(arrForFlyGroup)
    } else {
     if (item.geo) {
      this.selectObject({id: item.id, value: true})
      this.getObjectsLastPosition({objectId: item.device_id})
      this.flyToObject(item.device_id)
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
     this.selectObjectGroup({id: element.data.id, value: false})
    } else {
     if (item.geo) {
      this.selectObject({id: item.id, value: false})
     }
     // else {
     //  this.$store.dispatch('setError', 'У данного объекта отсутствуют координаты').then(() => {
     //   this.$store.dispatch('clearError')
     //  })
     // }
    }
   },

   flyToGroup(element) {
    let latLng = []
    if (element) {
     element.forEach(device_id => {
      for (let i in this.objects) {
       if (this.objects[i].device_id === device_id && this.objects[i]?.geo) {
        latLng.push([this.objects[i].geo.latitude, this.objects[i].geo.longitude])
       }
      }
     })
     if (latLng.length) {
      this.mapInstance.fitBounds(latLng, {maxZoom: 15})
     }
    } else {
     for (let i in this.objects) {
      if (this.objects[i].selected) {
       if (this.objects[i].geo) {
        latLng.push([this.objects[i].geo.latitude, this.objects[i].geo.longitude])
        this.mapInstance.fitBounds(latLng, {maxZoom: 15})
       }
      }
     }
    }
    latLng = []
    // else {
    //  this.$store.dispatch('setError', 'У объекта ' + this.objects[i].name + ' отсутствуют координаты').then(() => {
    //   this.$store.dispatch('clearError')
    //  })
    // }
   },

   flyToObject(device_id) {
    let lastPosition = Object.values(this.objects).filter(el => {
     return el.device_id === device_id
    }).map(el => el.geo)
    this.mapInstance.flyTo([lastPosition[0].latitude, lastPosition[0].longitude], 12)
   },

   async removeFromWorkSet(id) {
    await this.$store.dispatch('removeFromWorkSet', id)
    // await this.$store.dispatch('loadObjects')
   },

   async removeGroupFromWorkSet(id) {
    await this.$store.dispatch('removeGroupFromWorkSet', id)
    // await this.$store.dispatch('loadObjects')
   },

   async moveTo(object) {
    console.log(object, 'moveTo')
    object.forEach((el) => {
     this.mapInstance.flyTo([el.geo.latitude, el.geo.longitude], 12, {animate: true})
    })
   },

   monitorObjects(object) {
    clearInterval(this.interval)
    if (object.length !== 0) {
     this.interval = setInterval(() => {
      for (let i in object) {
       if (object[i].monitor && object[i].selected) {
        this.getObjectsLastPosition({objectId: object[i].device_id})
       }
      }
     }, 1000 * 5);
    } else {
     clearInterval(this.interval)
    }
   },

  },

  mounted() {
   this.root = this.$service.objectsArrayCreate(this.objectsgroups, this.objects);
   eventBus.$on('map-Clear', () => {
    this.selectedKeys = null
   });
  }
 }
</script>

<style scoped>
 .p-treetable-toggler {
  margin-left: 0 !important;
 }

 .red {
  background-color: red;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 7px;
 }

 .green {
  background-color: green;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin: 0 5px;
 }

 .yellow {
  background-color: yellow;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin: 0 5px;
 }
</style>