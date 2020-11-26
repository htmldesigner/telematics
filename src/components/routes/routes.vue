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
     >
      <span class="flex-grow-1">{{point.name}}</span>
      <input type="text"
             :value="point.radius" @input="inpitingRadius"
             @click="updatePointRadius(index)"
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
            :disabled="!route.points.length"
            @click="save"
    >Сохранить
    </button>
   </div>

  </div>

  <div class="routes-control-head mt-3 d-flex align-items-center">
   <input type="checkbox" v-model="selectAllRoutes">
   <select v-model="selectedOption" :required="true" class="select-custom-small ml-2">
    <option v-for="option in options" :value="option.value">{{option.name}}</option>
   </select>
  </div>

  <div class="created-routes-list" v-if="getRouteList">
   <ul class="p-0 m-0">
    <li v-for="(point, index) in getRouteList" :key="point.id"
        class="created-routes-list-row d-flex flex-wrap">
     <div class="created-routes-control-wrap d-flex justify-content-between w-100">

      <div class="created-routes-control">
       <input class="mr-2" :id="`routesSelector-${index}`" type="checkbox" :checked="selectAllRoutes">
       <label class="p-0 m-0" :for="`routesSelector-${index}`">{{point.name}}</label>
      </div>

      <div class="created-routes-control">
       <div class="ml-1 mr-2 d-flex" v-tooltip="'Расписание'" style="cursor: pointer"><img :src="icon.schedule"
                                                                                           alt="Alt"></div>
       <div class="ml-1 mr-1 d-flex"
            v-tooltip="'Редактировать'"
            style="cursor: pointer"
            @click="editableRoute(point.id)"
       ><img :src="icon.key" alt="Alt">
       </div>
       <div class="ml-1 mr-2 d-flex"
            v-tooltip="'Удалить'"
            style="cursor: pointer"
       ><img style="width: 18px;" :src="icon.remove" alt=""></div>
      </div>

     </div>

     <ul v-if="point.points && selectedOption === 'CheckPoint'">
      <li v-for="route in point.points">
       <span>{{route.address ? route.address : route.name}}</span>
      </li>
     </ul>

    </li>
   </ul>
  </div>
{{radius}}
  <checkPoint
   v-if="checkPointWindow"
   @close="closePointWindow"
   @add-point="addPoint"
  >
  </checkPoint>

 </div>

</template>

<script>
 import checkPoint from "./checkPoint";
 import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

 export default {
  components: {
   checkPoint
  },
  computed: {
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
  name: "routes",
  data() {
   return {
    createRoutes: false,
    editRoutes: false,
    selectAllRoutes: false,
    selectedOption: 'Routes',
    checkPointWindow: false,

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
   addPoint(point) {
    this.route.points.push(point)
   },

   removePoint(index) {
    this.route.points = this.route.points.filter((el, idx) => {
     return idx !== index
    })
   },

   //Create new routes
   async save() {
    if (this.createRoutes === true) {
     this.route.name = this.name
     this.route.description = this.routeDescription
     this.route.ispublished = true
     console.log(this.route, 'save')
     // await this.$store.dispatch('addRoute', this.route)
     // await this.$store.dispatch('getRouteList')
    }
    if (this.editRoutes === true) {
     this.route.name = this.name
     this.route.description = this.routeDescription
     this.route.ispublished = true
     console.log(this.route, 'edit')
     // await this.$store.dispatch('addRoute', this.route)
     // await this.$store.dispatch('getRouteList')
    }
    this.nullifyRoute()
   },

   editableRoute(id) {
    this.nullifyRoute()
    let element = this.getRouteList.filter(route => route.id === id)
    if (element[0].ispublished === true) {
     this.editRoutes = true
     this.route = element[0]
     this.name = element[0].name
     this.routeDescription = element[0].description
     element = null
     console.log(this.route)
    } else {
     this.$store.dispatch('setError', 'Нередактируемый').then(() =>{
      this.$store.dispatch('clearError')
     })
    }
   },

   closePointWindow() {
    this.checkPointWindow = false
   },

   updatePointRadius(index){
    let point = this.route.points.filter((point, idx) => +idx === +index)
    console.log(point)
   },

   inpitingRadius(event){
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
   }

  },
  mounted() {

  }
 }
</script>

<style scoped>

</style>