<template>
 <div id="app" v-if="loader === false">
  <template v-if="error">
   <div class="alert alert-danger text-center" role="alert">
    {{this.error}}
   </div>
  </template>
  <router-view/>
 </div>
</template>
<script>

 export default {
  name: 'App',
  computed: {
   loader(){
    return this.$store.getters.loading
   },
   error() {
    return this.$store.getters.error
   },
  },
  created() {
   this.$store.dispatch('loadObjects')
  }
 }
</script>
<style>
 .splitpanes.default-theme .splitpanes__pane {
  background-color: #fff !important
 }
</style>