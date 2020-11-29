<template>
 <div class="routes-container mt-3 px-2">

  <div class="routes-control-actions" v-if="!createRoutes && editRoutes !== true">
   <button type="button" class="btn-custom" @click="createRoutesButton">
    <span>Создать маршрут</span>
   </button>
  </div>

  <div class="routes-control-create mt-3" v-if="createRoutes || editRoutes">

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
    <div class="d-flex w-75">
     <button v-tooltip="'Добавить контрольные точки'"
             @click="checkPointWindow = true"
             class="btn-custom-outline w-100">
      <img :src="icon.mapMarker" alt="Alt">
     </button>
     <button
      v-tooltip="'Добавить геозоны как контрольные точки'"
      @click="geoZonePointWindow = true"
      class="btn-custom-outline w-100">
      <img :src="icon.penta" alt="Alt">
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
      <input type="text"
             v-model="point.radius"
             class="input-custom-small mr-1"
      >
      <span>м</span>
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
            @click="createRoutes = false, checkPointWindow = false, editRoutes = false, nullifyRoute()">Закрыть
    </button>
    <button class="btn-custom ml-2"
            v-if="createRoutes"
            :disabled="!route.points.length"
            @click="save"
    >Сохранить
    </button>
    <button class="btn-custom ml-2"
            v-if="editRoutes"
            :disabled="!route.points.length"
            @click="save"
    >Обнавить
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
       <div class="ml-1 mr-2 d-flex" v-tooltip="'Расписание'" style="cursor: pointer">
        <img :src="icon.schedule" alt="Alt">
       </div>
       <div class="ml-1 mr-1 d-flex"
            v-tooltip="'Редактировать'"
            style="cursor: pointer"
            @click="editableRoute(route.id)"
       ><img :src="icon.key" alt="Alt">
       </div>
       <div class="ml-1 mr-2 d-flex"
            v-tooltip="'Удалить'"
            style="cursor: pointer"
            @click="deleteRoute(route.id)"
       ><img style="width: 18px;" :src="icon.remove" alt=""></div>
      </div>

     </div>

     <ul v-if="route.points && selectedOption === 'CheckPoint'">
      <li v-for="point in route.points">
       <span>{{point.address ? point.address : point.name}}</span>
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
  >
  </geoZonePoint>

 </div>

</template>

<script>
 import checkPoint from "./checkPoint";
 import geoZonePoint from "./geoZonePoint";
 import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

 export default {
  components: {
   checkPoint,
   geoZonePoint
  },
  computed: {
   ...mapState('mapModule', ['mapInstance']),
   ...mapGetters({
    getRouteList: 'getRouteList'
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
      this.renderCheckPoints(this.route)
    },
    deep: true,
   },
  },
  name: "routes",
  data() {
   return {
    createRoutes: false,
    editRoutes: false,
    selectAll: false,
    selectedOption: 'Routes',
    checkPointWindow: false,
    geoZonePointWindow: false,
    dragging: -1,
    routeLayer: new L.featureGroup(),

    geoJsonData: [],

    //For send
    name: null,
    routeDescription: null,
    radius: null,
    options: [
     {name: 'Маршруты', value: 'Routes'},
     {name: 'Контрольные точки', value: 'CheckPoint'},
    ],

    icon: {
     remove: require('@/assets/remove.svg'),
     mapMarker: require('@/assets/map-marker.svg'),
     penta: require('@/assets/penta.svg'),
     key: require('@/assets/key.svg'),
     schedule: require('@/assets/schedule.svg')
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
     console.log(this.route, 'save')
     await this.$store.dispatch('addRoute', this.route)
     await this.$store.dispatch('getRouteList')
    }
    //edit route
    if (this.editRoutes === true) {
     this.route.name = this.name
     this.route.description = this.routeDescription
     this.route.ispublished = false
     console.log(this.route, 'edit')
     await this.$store.dispatch('editRoute', this.route)
     await this.$store.dispatch('getRouteList')
    }
    this.nullifyRoute()
   },

   //Keep id
   editableRoute(id) {
    this.createRoutes = false
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

   async deleteRoute(id) {
    await this.$store.dispatch('deleteRoute', id)
    await this.$store.dispatch('getRouteList')
   },

   closePointWindow() {
    this.checkPointWindow = false
   },

   closeGeoZonePointWindow() {
    this.geoZonePointWindow = false
   },

   updatePointRadius(index) {
    let point = this.route.points.filter((point, idx) => +idx === +index)
    console.log(point)
   },

   inpitingRadius(event) {
    console.log(event.target.value)
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
    }else{
     this.selectAll = false
     this.geoJsonData = []
     this.routeLayer.clearLayers()
    }
   },

   selectRoute(event, route) {
    if (event.target.checked) {
     let coordinates = []
     let checkPoints = []

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
     })

     this.geoJsonData.push(prepareGeoJsonRoute, ...checkPoints)
     this.renderRoute()
     prepareGeoJsonRoute = null
     coordinates = null
     checkPoints = null
    } else {
     this.geoJsonData = this.geoJsonData.filter(el => {
      return el.id !== route.id && el.belongRoute !== route.id
     })
     this.renderRoute()
    }
   },

   renderCheckPoints(route) {
    if (route) {
     this.geoJsonData = []
     let coordinates = []
     let checkPoints = []

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
     })

     this.geoJsonData.push(prepareGeoJsonRoute, ...checkPoints)
     this.renderRoute()
     prepareGeoJsonRoute = null
     coordinates = null
     checkPoints = null
     this.geoJsonData = []
    }
   },

   renderRoute() {
    this.routeLayer.clearLayers()

    if (this.geoJsonData.length) {
     let route = []
     let point = []
     this.geoJsonData.forEach(el => {
      if (el.properties.type === 'route') {
       route.push(el)
      } else {
       point.push(el)
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

     this.routeLayer.addLayer(readyRoute)
     this.routeLayer.addLayer(readyMarker)
     this.routeLayer.addLayer(readyPoint)

     this.mapInstance.flyToBounds(readyRoute.getBounds(), {duration: 0.5})

     route = null
     point = null
     readyRoute = null
     readyPoint = null
     readyMarker = null
    }
   },

   buildRouteOnMap() {

   }

  },
  updated() {
   this.routeLayer.addTo(this.mapInstance)
  },
  mounted() {

  }
 }
</script>

<style scoped>

</style>