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
 import {mapActions, mapGetters} from "vuex";
 import {eventBus} from "./eventBus";

 export default {
  name: 'App',
  data() {
   return {
    load: true,
    interval: null
   }
  },
  components: {
   Loader
  },
  computed: {
   ...mapGetters({
    realtime: 'isRealTime',
    timerInterval: 'getTimerInterval',
   }),
   loader() {
    return this.$store.getters.loading
   },
   error() {
    return this.$store.getters.error
   },
  },
  watch: {
   realtime: {
    handler(val) {
     if (val) {
      this.watcher()
     } else {
      clearInterval(this.interval)
     }
    }
   }
  },
  methods: {
   ...mapActions(['realTimeWatch']),

   watcher() {
    if (this.realtime) {
     this.interval = setInterval(() => {
      this.realTimeWatch()
     }, (this.timerInterval > 0 ? this.timerInterval : 5) * 1000)
    } else {
     clearInterval(this.interval)
     return false
    }
   }
  },
  async created() {
   await this.$store.dispatch('loadObjects')
   await setTimeout(() => {
    this.load = false
   }, 500)
  },
  mounted() {
   this.watcher()
  },

 }
</script>
<style>
 .splitpanes.default-theme .splitpanes__pane {
  background-color: #fff !important
 }
</style>