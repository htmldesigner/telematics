<template>
 <div class="mt-3 px-3">
  <component :is="currentComponent" v-on:component-link="componentLink"></component>
 </div>
</template>

<script>
 import monitoringList from './monitoringList'
 import monitoringGroup from "./monitoringGroup";
 export default {
  data(){
   return{
    search: '',
    currentComponent: 'monitoringList'
   }
  },
  components: {
   monitoringList,
   monitoringGroup
  },
  methods: {
   componentLink(componentName){
    this.currentComponent = componentName
   }
  },


 }
</script>

<style scoped>

</style>