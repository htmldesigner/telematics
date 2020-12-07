<template>
 <div class="roundList-container">
  <div class="roundList-container-header">
   <div class="roundList-title">
    <p>Рейсы по расписанию</p>
    <select class="select-custom-small ml-3" v-model="roundId">
     <option v-for="schsdule in getRouteList" :value="schsdule.id">{{schsdule.name}}</option>
    </select>
   </div>
  </div>
<!--{{routes}}-->
  <div class="rounds-grid mx-2 mt-4">
   <div class="table-responsive-sm">
    <table class="table table-sm table-striped">
     <thead>
      <tr>
       <th class="text-center">Время</th>
       <th class="text-center" style="border-left: 1px solid #cdd5d8">Рейс</th>
       <th class="text-center" style="border-left: 1px solid #cdd5d8">Состояние рейса</th>
       <th class="text-center" style="border-left: 1px solid #cdd5d8">Порядок прохождения точек</th>
       <th class="text-center" style="border-left: 1px solid #cdd5d8">Объект</th>
       <th style="border-left: 1px solid #cdd5d8" width="2%" class="text-right">X</th>
      </tr>
     </thead>
     <tbody>

     </tbody>
    </table>

   </div>
  </div>

  <div class="mt-5">
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
  data() {
   return {

   }
  },
  computed: {
   ...mapGetters({
    getPaneSize: 'getPaneSize',
    getRouteList: 'getRouteList'
   }),
   routes(){
    return  this.$store.getters.getRouteList.filter((route) => route.id === this.roundId)
   }
  },
  watch: {
   getPaneSize: {
    handler() {
     this.responsivePanel()
    }
   }
  },
  methods: {
   responsivePanel() {
    let leftPanel = document.querySelector('.roundList-container')
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

</style>