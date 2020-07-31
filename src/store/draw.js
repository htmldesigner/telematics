import api from "@/app/api"
import axios from "axios";

export default {
    state: {
        layers: []
    },
    getters: {
        getDrawLayers: state => state.layers,
    },
    mutations: {
        setDrawLayers(state, payload) {
            Vue.set(state.layers, payload.id, payload);
        },
        clearDrawAll(state) {
            state.layers = []
        }
    },
    actions: {
        clearDrawAll({ commit }) {
            commit('clearDrawAll')
        },
        saveGeozones({ commit, state },params) {
            return Promise.resolve(api.saveGeozoneGeometry(params.id,params.layersData).then(response => {
                if(response.status == 200){
                    console.log(response.data.data);
                }else{
                    eventBus.$emit('showmessage', response.data.errors,'error');
                    console.errors(response.data);
                }
            }).catch(error => {
                eventBus.$emit('showmessage', error.data.errors,'error');
                console.log(error) }));
        }
    }
}