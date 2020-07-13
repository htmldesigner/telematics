<template>
 <div id="app" v-if="loader === false">
  <Loader v-if="load"/>
  <template v-if="error">
   <div class="alert alert-danger text-center" role="alert">
    {{this.error}}
   </div>
  </template>
  <router-view/>
 </div>
</template>
<script>
 import Loader from "./components/Loader";
 import {mapActions} from "vuex";
 export default {
  name: 'App',
  data() {
   return {
    load: true
   }
  },
  components: {
   Loader
  },
  computed: {
   loader() {
    return this.$store.getters.loading
   },
   error() {
    return this.$store.getters.error
   },
  },
  methods: {
   ...mapActions(['realTimeWatch']),

   alweysWatch(){
    setInterval(()=>{
     this.realTimeWatch()
    },1000 * 30)
   }

  },
  async created() {
   await this.$store.dispatch('loadObjects')
   await setTimeout(() => {
    this.load = false
   }, 1000)
   this.alweysWatch()
  }
 }
</script>
<style>
 .splitpanes.default-theme .splitpanes__pane {
  background-color: #fff !important
 }
</style>