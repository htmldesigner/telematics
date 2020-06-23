<template>
 <div id="app">
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
   error() {
    return this.$store.getters.error
   },
  },
  methods: {}
 }
</script>
<style>
 .splitpanes.default-theme .splitpanes__pane{
  background-color: #fff!important
 }

 /*@import "~bootstrap/dist/css/bootstrap.min.css";*/
</style>