import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import firebase from './Firebase'
import router from './router'
import store from './store/store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vuelidate from 'vuelidate'
import './registerServiceWorker'
import VueOffline from 'vue-offline'
Vue.use(VueOffline)
require('dotenv').config()
Vue.use(Vuelidate)

Vue.config.productionTip = false

// Initialize Firebase
const config = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_ID
}
firebase.initializeApp(config)

firebase.firestore().enablePersistence()
  .catch(function (err) {
    if (err.code === 'failed-precondition') {
      console.log('persistence error : one-tab only')
    } else if (err.code === 'unimplemented') {
      console.log('persistence error non implemented')
    }
  })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
