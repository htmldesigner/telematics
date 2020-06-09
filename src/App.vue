
<template>
  <v-app id="inspire">

    <v-card
            color="grey lighten-4"
            flat
            tile
    >
      <v-toolbar dense>
        <v-toolbar-items class="hidden-md-and-down">
          <v-btn
                  text
                  depressed
                  style="text-transform: none; font-size: 12px"
                  v-for="link of links"
                  :key="link.title"
                  @click="currentLink = link.alias"
          >
            <v-icon left>{{link.icon}}</v-icon>
            {{link.title}}
          </v-btn>
        </v-toolbar-items>

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-app-bar-nav-icon>

          <v-btn icon>
            <v-icon>mdi-apps</v-icon>
          </v-btn>

          <v-btn text>
            <v-icon>mdi-logout-variant</v-icon>
          </v-btn>

        </v-toolbar-items>
      </v-toolbar>
    </v-card>

    <v-navigation-drawer
            class="accent-4"
            v-model="drawer"
            style="position: absolute; z-index: 3500"
    >

      <v-list>
        <v-list-item
                v-for="link of links"
                :key="link.title"

        >
          <v-list-item-icon>
            <v-icon>{{link.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="link.title"></v-list-item-title>
          </v-list-item-content>

        </v-list-item>
      </v-list>
    </v-navigation-drawer>

  <Split style="height: 100%;">
    <SplitArea :size="25" >
      <component v-bind:is="currentComponent"></component>
    </SplitArea>
    <SplitArea :size="75">
      <llmap></llmap>
    </SplitArea>
  </Split>


  </v-app>
</template>

<script>
  import axios from 'axios';
  import llmap from './components/llmap'
  import about from './views/About'
  import monitoring from "./components/monitoring";
  import tracker from "./components/tracker";
  export default {
    components:{
      llmap, about, monitoring, tracker
    },

    data(){
      return {
        dialog: false,
        drawer: false,
        currentLink: "monitoring",
        links:  [
          {title: 'Маниторинг', alias: 'monitoring', icon: 'mdi-earth'},
          {title: 'Треки', alias: 'tracker', icon: 'mdi-flag-checkered'},
          {title: 'Сообщения', alias: 'message', icon: 'mdi-message-text-outline', url: '/new2'},
          {title: 'Отчеты', icon: 'mdi-playlist-check', url: '/new3'},
          {title: 'Геозоны', icon: 'mdi-shape-polygon-plus', url: '/new4'},
          {title: 'Маршруты', icon: 'mdi-highway', url: '/new5'},
          {title: 'Водители', icon: 'mdi-steering', url: '/new6'},
          {title: 'Пассажиры', icon: 'mdi-transit-transfer', url: '/new7'},
          {title: 'Задания', icon: 'mdi-format-list-checks', url: '/new8'},
          {title: 'Уведомления', icon: 'mdi-timetable', url: '/list9'},
          {title: 'Пользователи', icon: 'mdi-account', url: '/list0'},
          {title: 'Обьекты', icon: 'mdi-bus', url: '/list11'},
        ]
      }
    },
    computed: {
      currentComponent: function() {
        return this.currentLink;
      }
    },
    mounted() {
      axios
              .get('https://api.openbrewerydb.org/breweries/5494')
              .then(response => {
                console.log(response.data)});
    }
  }
</script>