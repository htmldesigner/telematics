<template>
 <div style="width: 100%">
  <ul class="nav nav-tabs">
   <li v-for="(tab, idx) in tabs" :key="idx" class="nav-item">
    <a class="nav-link" :class="{active: tab.tab === selected}" @click="setTab(tab.tab)">
     {{tab.tab}}
    </a>
    <div class="close-tab" @click="$emit('tab-close', tab.alias)"><img :src='icon.remove' alt=""></div>
   </li>
  </ul>
  <slot></slot>
 </div>
</template>

<script>
 export default {
  name: "TabNav",
  data() {
   return {
    icon: {
     remove: require('@/assets/remove.svg'),
    },
   }
  },
  props: {
   tabs: {
    type: Array,
    // required: true
   },
   selected: {
    type: String,
    // required: true
   }
  },
  methods: {
   setTab(tab) {
    this.$emit('selected', tab)
   }
  }
 }
</script>

<style scoped>

</style>