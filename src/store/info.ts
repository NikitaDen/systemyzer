import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default {
    state: {
        info: {},
        activePage: null
    },
    mutations: {
        setInfo: (state: any, info: any) => {
            state.info = info
        },
        clearInfo: (state: any) => {
            state.info = {}
        },
        setActivePage: (state: any, activePage: string) => {
            state.activePage = activePage
        },
    },
    getters: {
        activePage: (state: any) => state.activePage
    },
    actions: {
    },
    modules: {
    }
}
