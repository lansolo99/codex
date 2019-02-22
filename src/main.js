import '@babel/polyfill'
import Vue from 'vue'
import firebase from 'firebase'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

Vue.config.productionTip = false

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDHrCM-InqHNQD_Avo6m26TLSfJkiiBeqE',
  authDomain: 'codex-208f0.firebaseapp.com',
  databaseURL: 'https://codex-208f0.firebaseio.com',
  projectId: 'codex-208f0',
  storageBucket: 'codex-208f0.appspot.com',
  messagingSenderId: '545270095530'
}
firebase.initializeApp(config)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
