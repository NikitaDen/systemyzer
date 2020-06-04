import Vue from 'vue'
import Vuex from 'vuex'
import auth from "./auth";
import info from "./info";
import groups from "./groups";
// import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {

  },
  modules: {
    auth, info, groups
  }
})
