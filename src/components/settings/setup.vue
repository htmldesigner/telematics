<template>

 <transition name="modal">
  <div class="modal-mask">
   <div class="modal-wrapper">
    <div class="modal-container">
     <div class="modal-header">
      <slot name="header">
       <h4>Настройки</h4>
       <button
        type="button"
        class="close"
        data-dismiss="modal"
        aria-label="Close"
        @click="$emit('close')"
        title="Закрыть"
       >
        <span aria-hidden="true">X</span>
       </button>
      </slot>
     </div>

     <div class="modal-body">
      <slot name="body">

       <div class="form-group row">
        <label
         for="exampleFormControlSelect1"
         class="col col-form-label">Следить в реальном времени:</label>
        <div class="col-md-3">
         <select class="custom-select" id="exampleFormControlSelect1" v-model="isRealTime">
          <option :value="true">Да</option>
          <option :value="false">Нет</option>
         </select>
        </div>
       </div>

       <div class="form-group row">
        <label for="isRealTimeUpdate"
               class="col col-form-label">Период обновления, сек:</label>
        <div class="col-md-3">
         <input type="number"
                class="form-control"
                min="1" max="100"
                id="isRealTimeUpdate"
                v-model="timerInterval"
                :disabled="!isRealTime"/>
        </div>
       </div>

       <div class="form-group row">
        <label for="stopMinradius"
               class="col col-form-label">Минимальный радиус остановки, м:</label>
        <div class="col-md-3">
         <input type="number"
                class="form-control"
                min="1" max="1000"
                id="stopMinradius"
                v-model="stopMinRadius"
         />
        </div>
       </div>

       <div class="form-group row">
        <label for="stopMinduration"
               class="col col-form-label">Минимальная длительность остановки, сек:</label>
        <div class="col-md-3">
         <input type="number"
                class="form-control"
                min="1"
                id="stopMinduration"
                v-model="stopMinDuration"
         />
        </div>
       </div>

       <div class="form-group row">
        <label for="trackMinduration"
               class="col col-form-label">Минимальная длительность поездки, сек:</label>
        <div class="col-md-3">
         <input type="number"
                class="form-control"
                min="1"
                id="trackMinduration"
                v-model="trackMinDuration"
         />
        </div>
       </div>

       <div class="form-group row">
        <label for="overSpeedMinduration"
               class="col col-form-label">Минимальная длительность превышения, сек:</label>
        <div class="col-md-3">
         <input type="number"
                class="form-control"
                min="1"
                id="overSpeedMinduration"
                v-model="overSpeedMinDuration"
         />
        </div>
       </div>

       <div class="form-group row">
        <label for="geozoneVisitMinduration"
               class="col col-form-label">Минимальная длительность посещения геозоны, сек:</label>
        <div class="col-md-3">
         <input type="number"
                class="form-control"
                min="1"
                id="geozoneVisitMinduration"
                v-model="geoZoneVisitMinDuration"
         />
        </div>
       </div>

       <div>
        <div class="row mb-3 justify-content-center">
         <div class="col-md-2 d-flex justify-content-center">
          <span><strong>Скорость:</strong></span>
         </div>
         <div class="col-md-2 d-flex justify-content-center">
          <span><strong>Цвет:</strong></span>
         </div>
         <div class="col-md-2 d-flex justify-content-center">
          <button class="btn-custom-outline-small" title="Добавить" v-on:click="addSpeed">
           <span>+</span>
          </button>
         </div>
        </div>
        <div class="color-speed-container">
         <div class="row justify-content-center" v-for="(item, index) in speedLimits" :key="index">

          <div class="form-group col-md-2 mb-1 d-flex justify-content-center">
           <input
            style="padding: 0 5px 0 10px;"
            class="form-control"
            type="number"
            min="1"
            max="300"
            v-model="item.speed"
           />
          </div>

          <div class="col-md-2 d-flex justify-content-center align-items-center">
           <ColorPicker v-model="item.color"/>
          </div>

          <div class="col-md-2 d-flex justify-content-center align-items-center">
           <button title="Удалить" class="btn-custom-outline-small-danger" @click="deleteSpeed(index)">
            <span>-</span>
           </button>
          </div>
         </div>
        </div>
       </div>
      </slot>

     </div>

     <div class="modal-footer">

      <slot name="footer">

       <button class="btn-custom" @click="$emit('close')">
        Закрыть
       </button>
       <button class="btn-custom" @click="save()">
        Сохранить
       </button>

      </slot>

     </div>
    </div>
   </div>
  </div>
 </transition>
</template>

<script>


 import {mapGetters, mapActions, mapMutations} from 'vuex'

 import ColorPicker from 'primevue/colorpicker';

 export default {
  name: "setup",
  components: {
   ColorPicker
  },
  data() {
   return {
    object: [],
   }
  },
  computed: {
   ...mapGetters({
    realtime: 'isRealTime',
    getTimerInterval: 'getTimerInterval',
    getStopMinRadius: 'getStopMinRadius',
    getStopMinDuration: 'getStopMinDuration',
    getTrackMinDuration: 'getTrackMinDuration',
    getOverSpeedMinDuration: 'getOverSpeedMinDuration',
    getGeoZoneVisitMinDuration: 'getGeoZoneVisitMinDuration',
    speedLimits: 'getSpeedLimits',
   }),

   isRealTime: {
    set(val) {
     this.setRealTime(val);
    },
    get() {
     return this.realtime;
    }
   },

   timerInterval: {
    set(val) {
     this.setTimerInterval(val);
    },
    get() {
     return this.getTimerInterval;
    }
   },

   stopMinRadius: {
    set(val) {
     this.setStopMinRadius(val);
    },
    get() {
     return this.getStopMinRadius;
    }
   },

   trackMinDuration: {
    set(val) {
     this.setTrackMinDuration(val);
    },
    get() {
     return this.getTrackMinDuration;
    }
   },

   stopMinDuration: {
    set(val) {
     this.setStopMinDuration(val);
    },
    get() {
     return this.getStopMinDuration;
    }
   },

   overSpeedMinDuration: {
    set(val) {
     this.setOverSpeedMinDuration(val);
    },
    get() {
     return this.getOverSpeedMinDuration;
    }
   },

   geoZoneVisitMinDuration: {
    set(val) {
     this.setGeoZoneVisitMinDuration(val);
    },
    get() {
     return this.getGeoZoneVisitMinDuration;
    }
   },

  },
  methods: {
   ...mapMutations([
    'setRealTime',
    'setTimerInterval',
    'setStopMinRadius',
    'setStopMinDuration',
    'setTrackMinDuration',
    'setSpeedLimits',
    'setOverSpeedMinDuration',
    'setGeoZoneVisitMinDuration']),

   ...mapActions(['saveState']),

   save() {
    this.saveConfig();
    this.$emit('close')
   },

   saveConfig() {
    this.saveState({
     speedindex: this.speedLimits,
     isRealTime: this.isRealTime,
     stopMinradius: this.stopMinRadius,
     stopMinduration: this.stopMinDuration,
     trackMinduration: this.trackMinDuration,
     overSpeedMinduration: this.overSpeedMinDuration,
     geozoneVisitMinduration: this.geoZoneVisitMinDuration,
     timerInterval: this.timerInterval,
    })
   },

   deleteSpeed(index) {
    let self = this;
    this.speedLimits.splice(index, 1);
    console.log(this.speedLimits);
    Vue.nextTick(function () {
     self.$forceUpdate()
    });
   },

   getMaxSpeed() {
    let max = 0;
    for (let si of this.speedLimits) {
     if (max < +si.speed) {
      max = +si.speed;
     }
    }
    return +max;
   },

   addSpeed() {
    this.speedLimits.push({"speed": this.getMaxSpeed() + 5, color: "#0000ff"})
   },

  },
 }
</script>

<style scoped>

</style>