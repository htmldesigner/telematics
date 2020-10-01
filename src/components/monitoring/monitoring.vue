<template>
 <div class="mt-3 px-3">
  <keep-alive>
   <component :is="currentComponent" v-on:component-link="componentLink"></component>
  </keep-alive>
 </div>
</template>

<script>
 import monitoringList from './monitoringList'
 import monitoringGroup from "./monitoringGroup";

 export default {
  data() {
   return {
    search: '',
    currentComponent: 'monitoringList'
   }
  },
  components: {
   monitoringList,
   monitoringGroup
  },
  methods: {
   componentLink(componentName) {
    this.currentComponent = componentName
   }
  }
 }
</script>

<style scoped>

</style>