<template>
 <div>
  <nav class="navbar navbar-expand-xl navbar-light bg-light">
   <a class="navbar-brand" href="#">LOGO</a>
   <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
           aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
   </button>
   <div class="collapse navbar-collapse" id="navbarText">
    <ul class="navbar-nav mr-auto">
     <li v-for="(link, index) in links" :key="index" class="nav-item">
      <a href="" class="nav-link" @click.prevent="currentLink = link.alias">{{link.title}}</a>
     </li>
    </ul>

    <ul class="navbar-nav">
     <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
         data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
       Dropdown link
      </a>
      <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
       <a class="dropdown-item" href="#">Action</a>
       <a class="dropdown-item" href="#">Another action</a>
       <a class="dropdown-item" href="#">Something else here</a>
      </div>
     </li>
     <li class="nav-item">
      <router-link
       class="nav-link"
       teg="a" exact
       to="/Profile"
      >Профиль
      </router-link>
     </li>
     <li class="nav-item">
      <a href="/login"
         @click.prevent="logOut"
         class="nav-link"
      >Выход</a>
     </li>
    </ul>
   </div>
  </nav>

  <div class="container-fluid">
   <div class="row">
    <splitpanes class="default-theme" style="height: calc(100vh - 56px)">
     <pane min-size="12" size="20" max-size="40">
      <keep-alive>
       <component :is="currentComponent"></component>
      </keep-alive>
     </pane>
     <pane min-size="60" size="100" max-size="100">
      <llmap ref="llmap"></llmap>
     </pane>
    </splitpanes>
   </div>
  </div>

 </div>
</template>

<script>

 import monitoring from "../components/monitoring/monitoring";
 import tracker from "../components/tracker";
 import message from "../components/message";
 import llmap from '../components/llmap'
 import {Splitpanes, Pane} from 'splitpanes'
 import 'splitpanes/dist/splitpanes.css'
 export default {
  components: {
   llmap,
   monitoring,
   tracker,
   message,
   Splitpanes,
   Pane
  },  data() {
   return {
    currentLink: "monitoring",
    links: [
     {title: 'Маниторинг', alias: 'monitoring', icon: 'mdi-earth'},
     {title: 'Треки', alias: 'tracker', icon: 'mdi-flag-checkered'},
     {title: 'Сообщения', alias: 'message', icon: 'mdi-message-text-outline'},
     {title: 'Отчеты', icon: 'mdi-playlist-check'},
     {title: 'Геозоны', icon: 'mdi-shape-polygon-plus'},
     // {title: 'Маршруты', icon: 'mdi-highway'},
     // {title: 'Водители', icon: 'mdi-steering'},
     // {title: 'Пассажиры', icon: 'mdi-transit-transfer'},
     // {title: 'Задания', icon: 'mdi-format-list-checks'},
     // {title: 'Уведомления', icon: 'mdi-timetable'},
     // {title: 'Пользователи', icon: 'mdi-account'},
     // {title: 'Обьекты', icon: 'mdi-bus'},
    ]
   }
  },
  computed: {
   currentComponent: function () {
    return this.currentLink;
   },
  },
  methods: {
   logOut() {
    this.$store.dispatch('logOut')
     .then(() => {
      this.$router.push('/login')
     })
     .catch(() => {
     })
   }
  },
 }
</script>

<style scoped>

</style>