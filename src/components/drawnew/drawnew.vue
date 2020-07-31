<template>
 <div class="drawnew-container mt-3">

  <div v-on:click="$emit('component-link', 'geozoneList')">
  Геозоны
  </div>

  <div class="container">

   <div class="row">
    <div class="col d-flex justify-content-center">
     <div class="navigation-button d-flex">
      <button type="button" class="btn btn-success mx-1 px-3 py-1">
       <span>Начать</span>
      </button>
      <button type="button" class="btn btn-danger mx-1 px-3 py-1">
       <span>Очистить</span>
      </button>
      <button type="button" class="btn btn-primary mx-1 px-3 py-1">
       <span>Завершить</span>
      </button>
     </div>
    </div>
   </div>

   <div class="notice-block border  mt-3 p-3">
    <p>Необходимо выбрать группу, куда будут добавлены геозоны.</p>
    <p>Название геозоны устанавливается кликом по рисунку.</p>
   </div>

   <div class="row mt-3">
    <div class="col">
     <div class="geozoneSelector">
      <select class="form-control">
      <option>
       1
      </option>
      </select>
     </div>
    </div>
   </div>

   <button type="button" class="btn btn-primary mt-4 float-right mx-1 px-3 py-1">
    <span>Сохранить</span>
   </button>

  </div>
 </div>
</template>

<script>
 export default {
  name: "drawnew",
  data(){
   return {

   }
  }
 }
</script>

<style scoped>

</style>