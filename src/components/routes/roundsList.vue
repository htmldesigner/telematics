<template>
 <div class="roundList-container">
  <div class="roundList-container-header">
   <div class="roundList-title">
    <p>Рейсы по расписанию</p>
    <select class="select-custom-small ml-3" v-model="rId">
     <option v-for="schsdule in getRouteList" :value="schsdule.id">{{schsdule.name}}</option>
    </select>
   </div>
  </div>
  <div class="rounds-grid mx-2 mt-4">
   <div class="table-responsive-sm">
    <table class="table table-sm">
     <thead>
     <tr>
      <th class="text-center">Дата активации</th>
      <th class="text-center" style="border-left: 1px solid #cdd5d8">Рейс</th>
      <th class="text-center" style="border-left: 1px solid #cdd5d8">Состояние рейса</th>
      <th class="text-center" style="border-left: 1px solid #cdd5d8">Порядок прохождения точек</th>
      <th class="text-center" style="border-left: 1px solid #cdd5d8">Объекты</th>
      <th style="border-left: 1px solid #cdd5d8" width="2%" class="text-right"><img :src="icon.remove" alt="Alt"></th>
     </tr>
     </thead>
     <tbody>

     <tr v-for="(route, index) of getRoundList">
      <td class="text-center">{{$moment(route.activationtime).format('DD MM YYYY hh:mm:ss')}}</td>
      <td class="text-left">{{route.name}}</td>
      <td class="text-left">----</td>
      <td class="text-left">
       <span
        v-for="pointOrder in schedulePointOrder"
        v-if="pointOrder.value === route.pointorder"
       >{{pointOrder.name}}
      </span>
      </td>
      <td width="30%" class="text-left">
       <div v-if="route.flightObjects.length" style="max-height:60px; overflow: auto">
        <span v-for="(object) in route.flightObjects">{{object.name}}, </span>
       </div>
      </td>
      <td class="text-left" style="cursor: pointer" @click="deleteFlight(route.id)"><img :src="icon.remove" alt="Alt">
      </td>
     </tr>
     </tbody>
    </table>

   </div>
  </div>

  <div class="mt-5 ml-2">
   <button class="btn-custom-outline" @click="$emit('close')">Закрыть</button>
  </div>

 </div>
</template>

<script>
 import {mapGetters} from "vuex";

 export default {
  name: "roundsList",
  props: {
   roundId: {
    type: Number
   }
  },
  computed: {
   ...mapGetters({
    getPaneSize: 'getPaneSize',
    getRouteList: 'getRouteList',
    getRoundList: 'getRoundList'
   }),
   rId: {
    get() {
     return this.roundId
    },
    set(value) {
     this.$emit('setNewProps', value)
    }
   }
  },
  watch: {
   rId: {
    handler(val) {
     this.updateRoundList(val)
    }
   },
   getPaneSize: {
    handler() {
     this.responsivePanel()
    }
   },
   loadById: {
    handler(val) {
     this.updateRoundList(val)
    }
   }
  },
  data() {
   return {
    loadById: null,
    schedulePointOrder: [
     {name: "Cтрогий", value: 0},
     {name: "Возможны пропуски", value: 1},
     {name: "Произвольный", value: 2}
    ],
    icon: {
     remove: require('@/assets/remove.svg'),
    },
   }
  },

  methods: {
   responsivePanel() {
    let leftPanel = document.querySelector('.roundList-container')
    if (leftPanel) {
     leftPanel.style.width = `calc(99.9% - ${+this.getPaneSize}%)`
    }
   },
   async deleteFlight(id) {
    let reasonForLog = await this.confirmDelete()
    if (reasonForLog.length > 5) {
     await this.$store.dispatch('deleteFlight', {id: id, message: reasonForLog})
     await this.$store.dispatch('getFlightsForRoute', this.roundId)
    } else {
     return this.$store.dispatch('setError', 'Укажите причину удаления мин. 5 символов ').then(() => {
      this.$store.dispatch('clearError')
     })
    }

   },

   updateRoundList(value) {
    this.$store.dispatch('getFlightsForRoute', value)
   },

   confirmDelete() {
    return prompt('Причины удаления')
   }

  },
  mounted() {
   this.responsivePanel()
  }
 }
</script>

<style scoped>

</style>