<template>
 <div class="round-container">

  <div class="round-container-header">
   <div class="round-title">
    <p>Ручное создание рейса для маршрута "{{scheduleName}}"</p>
   </div>
  </div>

  <div class="round-sittings mt-3 ml-4">

   <div class="row justify-content-between">
    <div class="custom-form-label">Название рейса</div>
    <div class="">
     <input class="input-custom-time">
    </div>
   </div>


   <div class="row justify-content-between mt-2">
    <div class="custom-form-label">Тип расписания:</div>
    <select v-model="selectedScheduleType" class="select-custom-middle">
     <option v-for="type in scheduleType" :value="type.value">{{type.name}}</option>
    </select>
   </div>

   <div class="row justify-content-between mt-2">
    <div class="custom-form-label">Порядок прохождения точек:</div>
    <select v-model="selectedSchedulePointOrder" class="select-custom-middle">
     <option v-for="type in schedulePointOrder" :value="type.value">{{type.name}}</option>
    </select>
   </div>

   <div class="row justify-content-between mt-2">
    <div class="custom-form-label">Время активации</div>
    <div class="d-flex align-items-center">
     <input type="checkbox" v-model="activateTimeSelector" class="mr-3">
     <input class="input-custom-time" type="datetime-local" :disabled="!activateTimeSelector" v-model="activateTime">
    </div>
   </div>

   <div class="row justify-content-between mt-2">
    <div class="custom-form-label">Срок действия (дни:часы:минуты):</div>
    <div>
     <input class="input-custom-time" v-model="validity" v-mask="'##:##:##'">
    </div>
   </div>

   
  </div>

  <div class="ml-2 mt-4 d-flex flex-wrap schedule-objects">

   <div class="objects mr-3">
    <ul>
     <li v-for="object in objects" :key="object.id" v-tooltip="'Двайной клик для добавления'"
         @dblclick="addObject(object)">
      <span>{{object.name}}</span>
     </li>
    </ul>
   </div>

   <div class="addedObjects">
    <ul>
     <li v-for="object in selectedObject" :key="object.id" v-tooltip="'Двайной клик для исключения'"
         @dblclick="removeObject(object)">
      <span>{{object.name}}</span>
     </li>
    </ul>
   </div>
  </div>

  <div class="mt-5 ml-2">
   <button class="btn-custom-outline" @click="$emit('close')">Закрыть</button>
   <button class="btn-custom ml-2" @click="$emit('close')">Сохранить рейс</button>
  </div>
 </div>
</template>

<script>
 import {mask} from 'vue-the-mask'
 import {mapGetters} from "vuex";
 import moment from 'moment'
 export default {
  directives: {mask},
  name: "createRound",
  props: {
   roundId: {
    type: Number
   }
  },
  computed: {
   ...mapGetters({
    getPaneSize: 'getPaneSize',
   }),
   scheduleName(){
    let name = null
    this.route.forEach(element => {
     if(element.schedules){
      element.schedules.forEach(el => {
       name = el.name
      })
     }
    })
    return name
   }
  },
  watch: {
   getPaneSize: {
    handler() {
     this.responsivePanel()
    }
   }
  },
  data(){
   return {
    //helper variable
    activateTimeSelector: true,
    objects: this.$store.getters.getObjects,
    route: this.$store.getters.getRouteList.filter((route) => route.id === this.roundId),
    // scheduleName: this.$store.getters.getRouteList.filter((route) => route.id === this.roundId)[0]?.schedules?.[0].name,

    icon: {
     even: require('@/assets/even.svg'),
     odd: require('@/assets/odd.svg'),
     clear: require('@/assets/clearNumber.svg'),
    },

    // to Send
    activateTime: moment().format("YYYY-MM-DDT00:00"),
    selectedScheduleType: 0,
    selectedSchedulePointOrder: 0,
    schedulePointOrder: [
     {name: "Cтрогий", value: 0},
     {name: "Возможны пропуски", value: 1},
     {name: "Произвольный", value: 2}
    ],

    scheduleType: [
     {name: "Относительно суток", value: 0},
     {name: "Относительно активации", value: 1},
     {name: "Абсолютное", value: 2}
    ],

    selectedObject: [],
    checkedMonths: [],
    checkedWeekDay: [],
    checkedDay: [],
    validity: '00:25:00',
   }
  },
  methods: {

   addObject(obj) {
    this.selectedObject.push(obj)
    this.selectedObject = Array.from(new Set(this.selectedObject))
    this.objects = this.objects.filter(el => {
     return el.id !== obj.id
    })
   },

   removeObject(obj) {
    this.selectedObject = Array.from(this.selectedObject.filter(el => {
     return el.id !== obj.id
    }))
    this.objects.push(obj)
   },

   responsivePanel() {
    let leftPanel = document.querySelector('.round-container')
    if (leftPanel) {
     leftPanel.style.width = `calc(99.9% - ${+this.getPaneSize}%)`
    }
   }
  },
  mounted() {
   this.responsivePanel()
  }
 }
</script>

<style scoped>
 /*Объекты*/
 .objects, .addedObjects {
  border: 1px solid #e4e4e4;
  width: 500px;
  min-height: 150px;
  max-height: 300px;
  overflow: auto;
 }

 .objects, .addedObjects, ul {
  padding: 0;
  margin: 0;
 }

 .objects ul li {
  list-style: none;
  padding-left: 10px;
  border-bottom: 1px solid #f5f5f5;
 }

 .objects ul li:hover {
  background-color: #e4e4e4;
  cursor: pointer;
 }

 .addedObjects ul li {
  list-style: none;
  padding-left: 10px;
  border-bottom: 1px solid #f5f5f5;
 }

 .addedObjects ul li:hover {
  background-color: #e4e4e4;
  cursor: pointer;
 }
</style>