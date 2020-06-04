import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default {
    state: {
        info: {}
    },
    mutations: {
        setInfo: (state: any, info: any) => {
            state.info = info
        },
        clearInfo: (state: any) => {
            state.info = {}
        },
    },
    actions: {
    },
    modules: {
    }
}
