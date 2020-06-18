import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default {
  state: {
    info: {},
    isLoading: true,
    activePage: null,
    isTopicFormOpened: false
  },
  mutations: {
    setInfo: (state: any, info: any) => {
      localStorage.setItem('name', info.name);
      state.info = info
    },
    setIsLoading: (state: any, loading: boolean) => {
      state.isLoading = loading
    },
    clearInfo: (state: any) => {
      state.info = {}
    },
    setActivePage: (state: any, activePage: string) => {
      state.activePage = activePage
    },
  },
  getters: {
    activePage: (state: any) => state.activePage,
    isLoading: (state: any) => state.isLoading,
    isTopicFormOpened: (state: any) => state.isTopicFormOpened,
    info: (state: any) => state.info
  },
  actions: {
    setUserInfo({commit}: any, info: any) {
      commit('setInfo', info)
    }
  },
  modules: {}
}
