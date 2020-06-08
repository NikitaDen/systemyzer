import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default {
    state: {
        info: {},
        activePage: null,
        isTopicFormOpened: false
    },
    mutations: {
        setInfo: (state: any, info: any) => {
            localStorage.setItem('name', info.name);
            state.info = info
        },
        clearInfo: (state: any) => {
            state.info = {}
        },
        setActivePage: (state: any, activePage: string) => {
            state.activePage = activePage
        },
        setTopicFormState: (state: any, isOpened: boolean) => {
            state.isTopicFormOpened = isOpened
        }
    },
    getters: {
        activePage: (state: any) => state.activePage,
        isTopicFormOpened: (state: any) => state.isTopicFormOpened,
        info: (state: any) => state.info
    },
    actions: {
        setUserInfo({commit}: any, info: any) {
            commit('setInfo', info)
        }
    },
    modules: {
    }
}
