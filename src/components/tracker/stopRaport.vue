<template>
 <div>
  <Toast />
  <div class="col">
   <DataTable
    class="p-datatable-sm"
    :value="products"
    selectionMode="single"
    dataKey="id"
    @row-select="onRowSelect" @row-unselect="onRowUnselect"
   >
    <Column field="vin" header="Vin"></Column>
    <Column field="year" header="Year"></Column>
    <Column field="brand" header="Brand"></Column>
    <Column field="color" header="Color"></Column>
<!--    <Column field="code" header="Дата" :expander="true"></Column>-->
<!--    <Column field="name" header="Продолжительность"></Column>-->
<!--    <Column field="category" header="Пробег км."></Column>-->
<!--    <Column field="quantity" header="Адресс"></Column>-->
   </DataTable>
  </div>
 </div>
</template>

<script>
 import Toast from 'primevue/toast';
 export default {
  name: "stopRaport",
  components: {Toast},
  data(){
   return {
    products: [
     {"brand": "Volkswagen", "year": 2012, "color": "Orange", "vin": "dsad231ff"},
     {"brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345"},
     {"brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr"},
     {"brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh"},
     {"brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34"},
     {"brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj"},
     {"brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr"},
     {"brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34"},
     {"brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5"},
     {"brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s"}
    ],
    selectedProduct1: null,
   }
  },
  methods:{
   onRowSelect(event) {
    this.$toast.add({severity: 'info', summary: 'Product Selected', detail: 'Name: ' + event.data.brand, life: 3000});
   },
   onRowUnselect(event) {
    this.$toast.add({severity: 'warn', summary: 'Product Unselected', detail: 'Name: ' + event.data.brand, life: 3000});
   }
  }
 }
</script>

<style scoped>

</style>