import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


Vue.use(ElementUI);
Vue.use(Vuelidate);

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyBYwu1bRORwrc0NsEVeUt-7ta_4Wqdu4Rc",
  authDomain: "learner-6c112.firebaseapp.com",
  databaseURL: "https://learner-6c112.firebaseio.com",
  projectId: "learner-6c112",
  storageBucket: "learner-6c112.appspot.com",
  messagingSenderId: "696318892864",
  appId: "1:696318892864:web:a7cbc73216bf0cb599f8a5",
  measurementId: "G-HD8TKW0JY9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();


let app: any;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})