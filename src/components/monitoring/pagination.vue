<template>
 <div class="pagination">

  <div class="pagination-left">
   <button :disabled="!hasPrev()" @click.prevent="changePage(prevPage)"><span><</span></button>
  </div>

  <div class="pagination-mid">
   <ul>
    <li v-if="hasFirst()"><a href="#" @click.prevent="changePage(1)">1</a></li>
    <li v-if="hasFirst()" class="separation">...</li>
    <li v-for="page in pages" :class="{ current: current === page }">
     <a href="#" @click.prevent="changePage(page)" >
      {{ page }}
     </a>
    </li>
    <li v-if="hasLast()" class="separation">...</li>
    <li v-if="hasLast()"><a href="#" @click.prevent="changePage(totalPages)">{{ totalPages }}</a></li>
   </ul>
  </div>

  <div class="pagination-right">
   <button :disabled="!hasNext()" @click.prevent="changePage(nextPage)"><span>></span></button>
  </div>

 </div>
</template>


<script>
 export default {
  name: "pagination",
  props: {
   current: {
    type: Number,
    default: 1
   },
   total: {
    type: Number,
    default: 0
   },
   perPage: {
    type: Number,
    default: 9
   },
   pageRange: {
    type: Number,
    default: 2
   }
  },
  computed: {
   pages: function() {
    let pages = []

    for(var i = this.rangeStart; i <= this.rangeEnd; i++) {
     pages.push(i)
    }

    return pages
   },
   rangeStart: function() {
    var start = this.current - this.pageRange

    return (start > 0) ? start : 1
   },
   rangeEnd: function() {
    var end = this.current + this.pageRange

    return (end < this.totalPages) ? end : this.totalPages
   },
   totalPages: function() {
    return Math.ceil(this.total / this.perPage)
   },
   nextPage: function() {
    return this.current + 1
   },
   prevPage: function() {
    return this.current - 1
   }
  },
  methods: {
   hasFirst: function() {
    return this.rangeStart !== 1
   },
   hasLast: function() {
    return this.rangeEnd < this.totalPages
   },
   hasPrev: function() {
    return this.current > 1
   },
   hasNext: function() {
    return this.current < this.totalPages
   },
   changePage: function(page) {
    this.$emit('page-changed', page)
   }
  }

 }
</script>

<style scoped>

</style>