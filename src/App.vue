<template>
 <div id="app">
  <template v-if="error" />
  <Toast />
  <router-view/>
 </div>
</template>
<script>
 import {mapActions, mapGetters} from "vuex";
 import Toast from 'primevue/toast';
 export default {
  name: 'App',
  data() {
   return {
    interval: null
   }
  },
  components: {
   Toast,
  },
  computed: {
   ...mapGetters({
    realtime: 'isRealTime',
    timerInterval: 'getTimerInterval',
   }),
   loader() {
    return this.$store.getters.loading
   },
   error(val) {
    let error = this.$store.getters.error
    error ? this.showError(error) : error
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
   },

   showError(error) {
    this.$toast.add({severity:'error', summary: 'Ошибка', detail: error, life: 3000});
   },

  },

  async mounted() {
   this.watcher()
  },

 }
</script>
<style>
 .splitpanes.default-theme .splitpanes__pane {
  background-color: #fff !important
 }
</style>