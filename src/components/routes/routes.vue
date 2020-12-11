<template>
 <div class="routes-container mt-3 px-2">

  <div class="routes-control-actions" v-if="!createRoutes && editRoutes !== true && copyRoutes !== true">
   <button type="button" class="btn-custom" @click="createRoutesButton">
    <span>Создать маршрут</span>
   </button>
  </div>

  <div class="routes-control-create mt-3" v-if="createRoutes || editRoutes || copyRoutes">

   <div class="routes-create-name">
    <div class="form-group row">
     <label class="col-sm-3 custom-form-label">Имя:</label>
     <div class="col-sm-9">
      <input type="text" class="input-custom" v-model.trim="routeName">
     </div>
    </div>
   </div>

   <div class="routes-create-descr">
    <div class="form-group row">
     <label class="col-sm-3 custom-form-label">Описание:</label>
     <div class="col-sm-9">
      <input type="text" class="input-custom" v-model.trim="routeDescription">
     </div>
    </div>
   </div>

   <div class="routes-control-create-cp-actions d-flex align-items-center justify-content-between">
    <span style="line-height: 1;">Контрольные точки:</span>
    <div class="d-flex w-50">
     <button v-tooltip="'Добавить контрольные точки'"
             @click="checkPointWindow = true"
             class="btn-custom-outline w-100">
      <img style="vertical-align: text-top;" :src="icon.mapMarker" alt="Alt">
     </button>
     <button
      v-tooltip="'Добавить геозоны как контрольные точки'"
      @click="geoZonePointWindow = true"
      class="btn-custom-outline w-100">
      <img style="vertical-align: text-top;" :src="icon.penta" alt="Alt">
     </button>
    </div>
    <!--    <button class="btn-custom-outline w-100">geoZone</button>-->
   </div>

   <div class="routes-control-create-cp-list mt-3">
    <ul class="p-0 m-0">
     <li class="routes-control-create-cp-list-row justify-content-between d-flex align-items-center"
         v-for="(point, index) in route.points"
         :key="index"
         :draggable="true"
         @dragstart="startDrag($event, index)"
         @drop="onDrop($event, index)"
         @dragover.prevent
     >
      <span class="flex-grow-1">{{point.name}}</span>
      <input type="text" v-if="point.radius >= 0"
             v-model="point.radius"
             class="input-custom-small mr-1"
      >
      <span v-if="point.radius >= 0">м</span>
      <span class="ml-3 routes-control-cp-remove"
            @click="removePoint(index)"
      >
       <img style="width: 18px; display: block;" :src="icon.remove" alt="">
      </span>
     </li>
    </ul>
   </div>

   <div class="routes-control-create-actions mt-3 d-flex justify-content-end">
    <button class="btn-custom-outline"
            @click="createRoutes = false, checkPointWindow = false, editRoutes = false, copyRoutes = false, nullifyRoute()">Закрыть
    </button>
    <button class="btn-custom ml-2"
            v-if="createRoutes"
            :disabled="!route.points.length"
            @click="save"
    >Сохранить
    </button>
    <button class="btn-custom ml-2"
            v-if="editRoutes && !copyRoutes"
            :disabled="!route.points.length"
            @click="save"
    >Обнавить
    </button>
    <button class="btn-custom ml-2"
            v-if="copyRoutes"
            :disabled="!route.points.length"
            @click="save"
    >Копировать
    </button>
   </div>

  </div>

  <div class="routes-control-head mt-3 d-flex align-items-center">
   <input type="checkbox" v-model="selectAll" @click="selectAllRoutes($event)">
   <select v-model="selectedOption" :required="true" class="select-custom-small ml-2">
    <option v-for="option in options" :value="option.value">{{option.name}}</option>
   </select>
  </div>

  <div class="created-routes-list" v-if="getRouteList">
   <ul class="p-0 m-0">
    <li v-for="(route, index) in getRouteList" :key="route.id"
        class="created-routes-list-row d-flex flex-wrap">
     <div class="created-routes-control-wrap d-flex justify-content-between w-100">

      <div class="created-routes-control">
       <input class="mr-2" :id="`routesSelector-${index}`" @click="selectRoute($event, route)" type="checkbox"
              :checked="selectAll">
       <label class="p-0 m-0" :for="`routesSelector-${index}`">{{route.name}}</label>
      </div>

      <div class="created-routes-control">
       <div class="ml-1 mr-2 d-flex" v-tooltip="'Создать расписание'" style="cursor: pointer"
            @click="addSchedule(route.id), editRoutes = false"
       >
        <img :src="icon.schedule" alt="Alt">
       </div>

       <div class="ml-1 mr-2 d-flex"
            v-tooltip="'Список рейсов по этому маршруту'"
            style="cursor: pointer"
            @click="roundList(route.id), editRoutes = false"
       ><img :src="icon.rounds" alt="Alt">
       </div>

       <div v-if="route.schedules.length"
            v-tooltip="'Имеет расписание редактировать нельзя'"
            class="ml-1 mr-1 d-flex"
            style="cursor: pointer"
       ><img :src="icon.keyNotEdit" alt="Alt">
       </div>

       <div v-else-if="route.schedules.length === 0"
            v-tooltip="'Редактировать'"
            class="ml-1 mr-1 d-flex"
            style="cursor: pointer"
            @click="editableRoute(route.id)"
       ><img :src="icon.key" alt="Alt">
       </div>

       <div
            v-tooltip="'Копировать маршрутasx'"
            class="ml-1 mr-1 d-flex"
            style="cursor: pointer"
            @click="copyRoute(route.id)"
       ><img :src="icon.copy" alt="Alt">
       </div>

       <div class="ml-1 mr-2 d-flex"
            v-tooltip="'Удалить'"
            style="cursor: pointer"
            @click="deleteRoute(route.id)"
       ><img style="width: 18px;" :src="icon.remove" alt="">
       </div>

      </div>

     </div>

     <ul v-if="route.points && selectedOption === 'CheckPoint'">
      <li v-for="point in route.points">
       <span>{{point.address ? point.address : point.name}}</span>
      </li>
     </ul>

     <ul v-if="route.schedules && selectedOption === 'Schedule'" class="w-100">
      <li v-for="schedule in route.schedules" class="mb-1 d-flex justify-content-between align-items-center">

       <span style="cursor: pointer" @click="editSchedule(schedule.id), editRoutes = false">{{schedule.name}}</span>

       <div class="d-flex">
        <img
         @click="addRound(schedule.id, route.id)"
         v-tooltip="'Ручное создание рейса для маршрута'"
         class="ml-1"
         :src="icon.pencil"
         style="cursor: pointer; margin-right: 37px; width: 14px;" alt="Alt">

        <img style="cursor: pointer; width: 13px;" v-tooltip="'Копировать маршрут'" :src="icon.copy" alt="Alt">

        <img @click="deleteSchedule(schedule.id)" v-tooltip="'Удалить расписание'" class="ml-1 mr-2" :src="icon.remove"
             alt="Alt" style="width: 18px; cursor: pointer">
       </div>

      </li>
     </ul>

    </li>
   </ul>
  </div>

  <checkPoint
   v-if="checkPointWindow"
   @close="closePointWindow"
   @add-point="addPoint"
  >
  </checkPoint>

  <geoZonePoint
   v-if="geoZonePointWindow"
   @close="closeGeoZonePointWindow"
   @add-geoZone="addZone"
   :getGeozones="getGeozones"
  >
  </geoZonePoint>

 </div>

</template>

<script>
 import checkPoint from "./checkPoint";
 import geoZonePoint from "./geoZonePoint";
 import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
 import {eventBus} from "../../eventBus";


 export default {
  components: {
   checkPoint,
   geoZonePoint,
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    getRouteList: 'getRouteList',
    getGeozones: 'getGeozones'
   }),
   routeName: {
    get() {
     return this.name
    },
    set(newValue) {
     this.name = newValue
    }
   }
  },
  watch: {
   route: {
    handler() {
     this.setPointOrder()
     if (this.route.points.length) {
      this.renderCheckPoints(this.route)
     }
    },
    deep: true,
   },
  },
  name: "routes",
  data() {
   return {
    createRoutes: false,
    editRoutes: false,
    copyRoutes: false,
    selectAll: false,
    selectedOption: 'Routes',
    checkPointWindow: false,
    geoZonePointWindow: false,
    dragging: -1,
    routeLayer: new L.featureGroup(),
    editableRouteID: null,
    geoJsonData: [],

    //For send
    name: null,
    routeDescription: null,
    radius: null,
    options: [
     {name: 'Маршруты', value: 'Routes'},
     {name: 'Контрольные точки', value: 'CheckPoint'},
     {name: 'Расписания', value: 'Schedule'},
    ],

    icon: {
     rounds: require('@/assets/rounds.svg'),
     remove: require('@/assets/remove.svg'),
     mapMarker: require('@/assets/map-marker.svg'),
     penta: require('@/assets/penta.svg'),
     key: require('@/assets/key.svg'),
     keyNotEdit: require('@/assets/keyNotEdit.svg'),
     schedule: require('@/assets/schedule.svg'),
     pencil: require('@/assets/pencil.svg'),
     copy: require('@/assets/copy.svg')
    },

    route: {
     points: []
    }

   }
  },
  methods: {
   // Run when create, edit or remove point
   setPointOrder() {
    if (this.route.points.length) {
     let pointOrder = 0
     this.route.points.forEach((point, index) => {
      pointOrder++
      point.pointorder = parseInt(pointOrder)
     })
    }
   },

   addPoint(point) {
    this.route.points.push(point)
    this.setPointOrder()
   },

   addZone(zone) {
    this.route.points.push(zone)
    this.setPointOrder()
   },

   removePoint(index) {
    this.route.points.splice(index, 1)
    this.setPointOrder()
   },

   //Create new routes or update
   async save() {
    //Create new route
    if (this.createRoutes === true) {
     this.route.name = this.name
     this.route.description = this.routeDescription
     this.route.ispublished = false
     this.route.points.forEach(point => {
      point.geom = JSON.stringify(point.geom)
     })
     // console.log(this.route, 'save')
     await this.$store.dispatch('addRoute', this.route)
     await this.$store.dispatch('getRouteList')
    }
    //edit route
    if (this.editRoutes === true) {
     this.route.name = this.name
     this.route.description = this.routeDescription
     this.route.ispublished = false
     this.route.points.forEach(point => {
      point.geom = JSON.stringify(point.geom)
     })
     // console.log(this.route, 'edit')
     await this.$store.dispatch('editRoute', this.route)
     await this.$store.dispatch('getRouteList')

     let updatedRoute = this.getRouteList.filter(el => {
      return el.id === this.editableRouteID
     })
     this.renderCheckPoints(...updatedRoute)
    }


    if (this.copyRoutes === true) {
     this.route.name = this.name
     this.route.description = this.routeDescription
     this.route.ispublished = false
     this.route.points.forEach(point => {
      point.geom = JSON.stringify(point.geom)
     })
     // console.log(this.route, 'edit')
     await this.$store.dispatch('addRoute', this.route)
     await this.$store.dispatch('getRouteList')

     let updatedRoute = this.getRouteList.filter(el => {
      return el.id === this.editableRouteID
     })
     this.renderCheckPoints(...updatedRoute)
    }



    this.nullifyRoute()
   },

   //Keep id in sending array
   editableRoute(id) {
    this.editableRouteID = id
    this.$emit('add-schedule', {status: false})
    this.createRoutes = false
    this.copyRoutes = false
    this.nullifyRoute()
    let element = this.getRouteList.filter(route => route.id === id)
    if (element[0]) { // .ispublished === true
     this.editRoutes = true
     this.route = element[0]
     this.name = element[0].name
     this.routeDescription = element[0].description
     element = null
    } else {
     this.$store.dispatch('setError', 'Нередактируемый').then(() => {
      this.$store.dispatch('clearError')
     })
    }
   },


   async copyRoute(id) {
    this.editableRouteID = id
    this.$emit('add-schedule', {status: false})
    this.createRoutes = false
    this.editRoutes = false
    this.nullifyRoute()
    let element = this.getRouteList.filter(route => route.id === id)
    if (element[0]) { // .ispublished === true
     this.copyRoutes = true
     this.route = element[0]
     this.name = 'Копия'+ ' - ' + element[0].name
     this.routeDescription = element[0].description
     element = null
    }
   },


   async deleteRoute(id) {
    await this.$store.dispatch('deleteRoute', id)
    await this.$store.dispatch('getRouteList')
   },

   addSchedule(id) {
    this.$emit('add-schedule', {status: true, id})
   },

   async editSchedule(id){
    await this.$store.dispatch('getSchedulesById', id)
    await this.$emit('editSchedule', {status: true, id})
   },

   async addRound(schedule_id, route_id) {
    await this.$store.dispatch('getSchedulesById', schedule_id)
    await this.$emit('add-round', {status: true, schedule_id, route_id})
   },

   async roundList(id) {
    this.$store.dispatch('getFlightsForRoute', id)
    await this.$emit('roundList', {status: true, id})
   },

   async deleteSchedule(id) {
    await this.$store.dispatch('deleteSchedule', id)
    await this.$store.dispatch('getRouteList')
   },

   closePointWindow() {
    this.checkPointWindow = false
   },

   closeGeoZonePointWindow() {
    this.geoZonePointWindow = false
   },

   nullifyRoute() {
    return this.route = {
     name: null,
     description: null,
     ispublished: true,
     points: []
    }
   },

   createRoutesButton() {
    this.createRoutes = !this.createRoutes
    this.name = 'Новый маршрут'
    this.routeDescription = ''
    eventBus.$emit('closePanel');
   },

   //Drag
   startDrag(evt, index) {
    evt.dataTransfer.dropEffect = 'move'
    evt.dataTransfer.effectAllowed = 'move'
    this.dragging = index
   },

   onDrop(evt, to) {
    this.moveItem(this.dragging, to)
   },

   moveItem(from, to) {
    this.route.points.splice(to, 0, this.route.points.splice(from, 1)[0])
    this.setPointOrder()
    this.renderCheckPoints(this.route)
   },

   selectAllRoutes(event) {
    if (event.target.checked) {
     this.getRouteList.forEach(el => {
      this.selectRoute(event, el)
     })
    } else {
     this.selectAll = false
     this.geoJsonData = []
     this.routeLayer.clearLayers()
    }
   },

   selectRoute(event, route) {
    if (event.target.checked) {
     let coordinates = []
     let checkPoints = []
     let polygon = []

     let prepareGeoJsonRoute = {
      type: "Feature",
      id: route.id,
      properties: {type: "route"},
      geometry: {
       type: "LineString",
       coordinates: coordinates
      }
     }

     route.points.forEach((el) => {
      coordinates.push([el.lon, el.lat])

      checkPoints.push(
       {
        type: "Feature",
        belongRoute: route.id,
        properties: {
         "type": "points",
         radius: el.radius,
         pointOrder: el.pointorder,
         address: el.address ? el.address : el.name
        },
        geometry: {
         type: "Point",
         coordinates: [el.lon, el.lat]
        }
       }
      )

      if (el?.geom.type === "Polygon" || el?.geom.type === "MultiPolygon") {
       polygon.push(
        {
         type: "Feature",
         belongRoute: route.id,
         properties: {
          "type": "polygons",
          "color": el.geom.properties?.color === '0' ? 'black' : el.geom.properties?.color,
          radius: 0,
         },
         geometry: el.geom
        }
       )
      }
     })
     this.geoJsonData.push(prepareGeoJsonRoute, ...checkPoints, ...polygon)
     this.renderRoute()
     prepareGeoJsonRoute = null
     coordinates = null
     checkPoints = null
     polygon = null
    } else {
     this.geoJsonData = this.geoJsonData.filter(el => {
      return el.id !== route.id && el.belongRoute !== route.id
     })
     this.renderRoute()
    }
   },

   // Building track on map when user select checkpoint on map
   renderCheckPoints(route) {
    if (route) {
     this.geoJsonData = []
     let coordinates = []
     let checkPoints = []
     let polygon = []

     let prepareGeoJsonRoute = {
      type: "Feature",
      id: route.id,
      properties: {type: "route"},
      geometry: {
       type: "LineString",
       coordinates: coordinates
      }
     }

     route.points.forEach((el) => {
      coordinates.push([el.lon, el.lat])
      checkPoints.push(
       {
        type: "Feature",
        belongRoute: route.id,
        properties: {
         "type": "points",
         radius: el.radius,
         pointOrder: el.pointorder,
         address: el.address ? el.address : el.name
        },
        geometry: {
         type: "Point",
         coordinates: [el.lon, el.lat]
        }
       }
      )
      if (el?.geom?.type === "Polygon" || el?.geom?.type === "MultiPolygon") {
       polygon.push(
        {
         type: "Feature",
         belongRoute: route.id,
         properties: {
          "type": "polygons",
          "color": el.geom.properties.color === '0' ? 'black' : el.geom.properties.color,
          radius: 0,
         },
         geometry: el.geom
        }
       )
      }
     })

     this.geoJsonData.push(prepareGeoJsonRoute, ...checkPoints, ...polygon)

     this.renderRoute()
     prepareGeoJsonRoute = null
     coordinates = null
     checkPoints = null
     polygon = null
     this.geoJsonData = []
    }
   },

   // Building track if route already exist
   renderRoute() {
    this.routeLayer.clearLayers()
    if (this.geoJsonData.length) {
     let route = []
     let point = []
     let polygon = []

     this.geoJsonData.forEach(el => {
      if (el.properties.type === 'route') {
       route.push(el)
      }
      if (el.properties.type === 'points') {
       point.push(el)
      }
      if (el.properties.type === 'polygons' || el.properties.type === 'multipolygons') {
       polygon.push(el)
      }
     })

     let pointOptions = {
      fillColor: "#0033CC",
      color: "#0033CC",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6
     };

     function setPoint(feature, layer) {
      if (feature.properties) {
       layer.setRadius(layer.feature.properties.radius)
      }
     }

     // For route
     function style() {
      return {
       weight: 2,
       opacity: 1,
       color: "#0033CC",
       dashArray: '12',
       fillOpacity: 1
      }
     }

     let readyPoint = L.geoJSON(point, {
      pointToLayer: function (feature, latlng) {
       return L.circle(latlng, pointOptions)
      }, onEachFeature: setPoint
     })


     function stylePoligon(feature) {
      return {
       fillColor: feature.properties.color,
       weight: 2,
       opacity: 1,
       color: feature.properties.color,
       fillOpacity: 0.7
      };
     }

     let readyPolygon = L.geoJSON(polygon, {style: stylePoligon})

     let readyMarker = L.geoJSON(point, {
      pointToLayer: function (feature, latlng) {
       return L.marker(latlng, {
        icon: L.divIcon({
         className: 'as',
         html: '<div class="checkpoint-numder">' + feature.properties.pointOrder + '</div><p class="checkpoint-content">' + feature.properties.address + '</p>',
         iconSize: L.point(25, 25),
        })
       })
      }
     })

     let readyRoute = L.geoJSON(route, {style: style})

     this.routeLayer.addLayer(readyPolygon)
     this.routeLayer.addLayer(readyRoute)
     this.routeLayer.addLayer(readyMarker)
     this.routeLayer.addLayer(readyPoint)

     this.mapInstance.flyToBounds(readyRoute.getBounds(), {duration: 1, maxZoom: 10})

     route = null
     point = null
     polygon = null
     readyRoute = null
     readyPoint = null
     readyMarker = null
     readyPolygon = null
    }
   }

  },
  updated() {
   this.routeLayer.addTo(this.mapInstance)
  },
  mounted() {
   eventBus.$on('map-Clear', () => {
    this.routeLayer.clearLayers()
    this.route = {
     points: []
    }
    this.selectAll = false
   });
  }
 }
</script>

<style scoped>

</style>