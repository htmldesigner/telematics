<template>
 <div class="schedule-container">
  <div class="schedule-container-header">
   <div class="schedule-title">
    <p>Новое расписание</p>
   </div>
  </div>

  <div class="schedule-sittings mt-3 ml-4">

   <div class="row justify-content-between">
    <div class="custom-form-label">Название:</div>
    <div class="">
     <input class="input-custom-time" v-model="name">
    </div>
   </div>

   <div class="row justify-content-between mt-2">
    <div class="custom-form-label">Срок действия (дни:часы:минуты):</div>
    <div class="">
     <input class="input-custom-time" v-model="validity" v-mask="'##:##:##'">
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

   <div class="row align-items-center mt-2">
    <div class="custom-form-label mr-5">Удалить после завершения:</div>
    <input type="checkbox" v-model="deletewhencomplete">
   </div>

  </div>

  <ul class="nav nav-tabs mt-4">

   <li class="nav-item">
    <a class="nav-link"
       @click.prevent="setActive('schedule')"
       :class="{ active: isActive('schedule') }"
       href="#schedule">Раписание</a>
   </li>

   <li class="nav-item" v-if="selectedScheduleType !== 2">
    <a class="nav-link"
       @click.prevent="setActive('timeLimit')"
       :class="{ active: isActive('timeLimit') }"
       href="#timeLimit">Ограничения по времени</a>
   </li>

   <li class="nav-item">
    <a class="nav-link"
       @click.prevent="setActive('object')"
       :class="{ active: isActive('object') }"
       href="#object">Объекты</a>
   </li>

  </ul>
  <div class="tab-content mt-4">
   <div class="tab-pane" :class="{ 'active show': isActive('schedule') }">
    <div class="schedule-grid p-0 mt-4">
     <div class="table-responsive-sm">
      <table class="table table-sm table-striped">
       <thead class="thead-schedule">
       <tr>
        <th width="1%" class="text-center">#</th>
        <th width="55%" class="text-left th-font">Точка</th>
        <th width="80px" class="text-center th-font">Прибытие (Час./Мин.)</th>
        <th width="80px" class="text-center th-font">
         <input type="checkbox" @click="departure = !departure">
         Убытие (Час./Мин.)
        </th>
       </tr>
       </thead>
       <tbody>

       <tr v-for="(point, index) of schedulePoints">
        <td width="1%" class="text-center">{{index + 1}}</td>
        <td class="text-left">{{point.name}}</td>

        <td class="text-center" style="border-right: 1px solid #cdd5d8; border-left: 1px solid #cdd5d8">
         <input style="position: relative;top: -5px; width: 60px;"
                v-mask="'##:##'"
                class="input-custom-small"
                type="text"
                v-model="point.arrivetime"
         >
         <span>+-</span>
         <input style="position: relative;top: 5px; width: 60px"
                v-mask="'###'"
                class="input-custom-small"
                type="text"
                v-model="point.arrivetimetolerance"
         >
        </td>

        <td class="text-center">
         <input :disabled="!departure" style="position: relative; top: -5px; width: 60px"
                v-mask="'##:##'"
                class="input-custom-small"
                type="text"
                v-model="point.departuretime"
         >
         <span>+-</span>
         <input :disabled="!departure" style="position: relative; top: 5px; width: 60px"
                v-mask="'###'"
                class="input-custom-small"
                type="text"
                v-model="point.departuretimetolerance"
         >
        </td>

       </tr>
       </tbody>
      </table>
     </div>
    </div>
   </div>
   <div class="tab-pane fade" :class="{ 'active show': isActive('timeLimit') }">

    <div class="timeLimits">
     <div class="weekDay-wrap">
      <div class="weekDay-title" @click="weekDayShow = !weekDayShow"><span>Дни недели</span></div>
      <div class="weekDay" v-if="weekDayShow">
       <div v-for="(weekDay, index) in weekDays" :key="index">
        <input type="checkbox"
               class="d-none"
               :id="`weekDay-${index}`"
               :value="weekDay.value"
               v-model="checkedWeekDay">
        <label :for="`weekDay-${index}`"
               :class="{'checkedWeekDay' : checkedWeekDay.includes(weekDay.value)}"
               class="weekDayElement"
        >{{weekDay.day}}</label>
       </div>
      </div>
     </div>

     <div class="weekDay-wrap">
      <div class="weekDay-title" @click="monthsShow = !monthsShow"><span>Месяцы</span></div>
      <div class="weekDay" v-if="monthsShow">
       <div v-for="(month, index) in months" :key="index">
        <input type="checkbox"
               class="d-none"
               :id="`month-${index}`"
               :value="month.value"
               v-model="checkedMonths">
        <label :for="`month-${index}`"
               :class="{'checkedWeekDay' : checkedMonths.includes(month.value)}"
               class="weekDayElement"
        >{{month.month}}</label>
       </div>
      </div>
     </div>

     <div class="day-wrap">
      <div class="day-title" @click="dayShow = !dayShow"><span>Дни</span></div>

      <div class="d-flex" v-if="dayShow">

       <div class="day">
        <div v-for="(day, index) in days" :key="index">
         <input type="checkbox"
                class="d-none"
                :id="`day-${index}`"
                :value="day"
                v-model="checkedDay">
         <label :for="`day-${index}`"
                :class="{'checkedWeekDay' : checkedDay.includes(day)}"
                class="dayElement"
         >{{day}}</label>
        </div>
       </div>

       <div class="day-control d-flex flex-column">
        <img :src="icon.odd" @click="oddDay" alt="Alt">
        <img :src="icon.even" @click="evenDay" alt="Alt">
        <img :src="icon.clear" @click="resetDay" alt="Alt">
       </div>

      </div>

     </div>
    </div>

   </div>
   <div class="tab-pane fade" :class="{ 'active show': isActive('object') }">
    <div class="ml-2 d-flex flex-wrap schedule-objects">

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
   </div>
  </div>


  <div class="mt-2">
   <button class="btn-custom-outline" @click="$emit('close')">Закрыть</button>
   <button class="btn-custom ml-2" @click="createSchedule">Сохранить</button>
  </div>
 </div>
</template>

<script>
 import moment from 'moment'
 import {mask} from 'vue-the-mask'
 import {mapGetters} from "vuex";
 export default {
  directives: {mask},
  name: "schedule",
  props: {
   routeId: {
    type: Number
   }
  },
  computed: {
   ...mapGetters({
    getPaneSize: 'getPaneSize',
   }),

   schedulePoints() {
    let points = []
    let RouteList = this.$store.getters.getRouteList.filter((route) => route.id === this.routeId)
    RouteList.forEach((el) => {
     if(el.points){
      points =  el.points.map((point) => {return {
       routepoint_id: point.id,
       name: point.name,
       arrivetime: '00:00',
       arrivetimetolerance: 0,
       departuretime: '00:00',
       departuretimetolerance: 0,
       address: point.address,
      }})
     }
    })
    return points
   }

  },
  watch: {
   getPaneSize: {
    handler() {
     this.responsivePanel()
    }
   }
  },
  data() {
   return {
    //helper variable
    objects: this.$store.getters.getObjects,
    activeItem: 'schedule',
    weekDays: [
     {day: 'Понедельник', value: 'Понедельник'},
     {day: 'Вторник', value: 'Вторник'},
     {day: 'Среда', value: 'Среда'},
     {day: 'Четверг', value: 'Четверг'},
     {day: 'Пятница', value: 'Пятница'},
     {day: 'Суббота', value: 'Суббота'},
     {day: 'Воскресенье', value: 'Воскресенье'},
    ],
    months: [
     {month: 'Январь', value: 'Январь'},
     {month: 'Февраль', value: 'Февраль'},
     {month: 'Март', value: 'Март'},
     {month: 'Апрель', value: 'Апрель'},
     {month: 'Май', value: 'Май'},
     {month: 'Июнь', value: 'Июнь'},
     {month: 'Июль', value: 'Июль'},
     {month: 'Август', value: 'Август'},
     {month: 'Сентябрь', value: 'Сентябрь'},
     {month: 'Октябрь', value: 'Октябрь'},
     {month: 'Ноябрь', value: 'Ноябрь'},
     {month: 'Декабрь', value: 'Декабрь'},
    ],
    days: [...Array(31).keys()].map(x => ++x),

    weekDayShow: false,
    monthsShow: false,
    dayShow: false,
    departure: false,

    icon: {
     even: require('@/assets/even.svg'),
     odd: require('@/assets/odd.svg'),
     clear: require('@/assets/clearNumber.svg'),
    },

    // to Send
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
    validity: '00:25:00', // Срок действия
    // arrivalTime: '00:00', // ПРибытие
    // arrivalShiftTime: '00:00', // Сдвиг прибытия
    // departureTime: '00:00',
    // departureShiftTime: '00:00',
    deletewhencomplete: true,
    name: '',

    scheduleObjects: []
   }
  },
  methods: {

  async createSchedule(){
    let objects = this.selectedObject.map(object => {return{schedule_id: 0, object_id: object.id}})

   if(this.name.length < 4){
    return this.$store.dispatch('setError', 'Введите название расписания мин. 4 символа').then(() => {
     this.$store.dispatch('clearError')
    })
   }

   let schedulePoints = this.schedulePoints.map(point => {
    return {
     address: point.address,
     arrivetime: '01.01.0001' + ' ' + point.arrivetime,
     arrivetimetolerance: point.arrivetimetolerance,
     departuretime: '01.01.0001' + ' ' + point.departuretime,
     departuretimetolerance: point.departuretimetolerance,
     name: point.name,
     routepoint_id: point.routepoint_id
    }
   })

   let time = this.validity
   let arr = time.split(':')
   let days = Math.round(arr[0]) * 1440
   let hours = Math.round(arr[1]) * 60
   let minuts = Math.round(arr[2])
   let activetimeResult = days + hours + minuts

    let schedule =
     {
      route_id: this.routeId,
      type: this.selectedScheduleType,
      pointorder: this.selectedSchedulePointOrder,
      deletewhencomplete: this.deletewhencomplete,
      name: this.name,
      activetime: activetimeResult,
      schedulePoints: schedulePoints,
      scheduleObjects: objects,
      flights: [],

     }

   await this.$store.dispatch('addSchedule', schedule)
   await this.$store.dispatch('getRouteList')
   schedule = null
   this.name = ''
   this.$emit('close')
   },

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

   evenDay() {
    this.checkedDay = []
    this.days.forEach(day => {
     if (day % 2 === 0) {
      this.checkedDay.push(day)
     }
    })
   },
   oddDay() {
    this.checkedDay = []
    this.days.forEach(day => {
     if (day % 2) {
      this.checkedDay.push(day)
     }
    })
   },
   resetDay() {
    this.checkedDay = []
   },

   isActive(menuItem) {
    return this.activeItem === menuItem
   },
   setActive(menuItem) {
    this.activeItem = menuItem
   },

   responsivePanel() {
    let leftPanel = document.querySelector('.schedule-container')
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

 .weekDay-title {
  margin-top: 5px;
  width: 500px;
  padding: 4px;
  background-color: #e4e4e4;
  cursor: pointer;
 }

 .weekDay-title span {
  margin-left: 12px;
  font-family: RobotoBold;
  font-size: 13px;
 }

 .weekDay {
  display: flex;
  margin-top: 10px;
  width: 350px;
  flex-wrap: wrap;
 }

 .weekDayElement {
  font-size: 13px;
  background-color: #fff;
  border: 1px solid #e4e4e4;
  padding: 2px 10px;
  margin: 1px;
  width: 110px;
  text-align: center;
 }

 .weekDayElement.checkedWeekDay {
  background-color: #e4e4e4;
 }


 /*Day*/
 .day-title {
  margin-top: 5px;
  width: 500px;
  padding: 4px;
  background-color: #e4e4e4;
  cursor: pointer;
 }

 .day-title span {
  margin-left: 12px;
  font-family: RobotoBold;
  font-size: 13px;
 }

 .day {
  display: flex;
  margin-top: 10px;
  width: 280px;
  flex-wrap: wrap;
 }

 .dayElement {
  font-size: 13px;
  background-color: #fff;
  border: 1px solid #e4e4e4;
  padding: 2px 5px;
  margin: 1px;
  width: 25px;
  text-align: center;
 }

 .dayElement.checkedWeekDay {
  background-color: #e4e4e4;
 }

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

 .day-control {
  margin-top: 10px;
 }

 .day-control img {
  margin-top: 8px;
  cursor: pointer;
 }

 .day-control img:first-child {
  margin-top: 3px;
 }

</style>