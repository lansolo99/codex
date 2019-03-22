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

const messaging = firebase.messaging()

messaging.usePublicVapidKey('BMZ27Tax1A9db5QrZpnHVs7mIUJS8walNQrElirXRA6B11i-t_I0INmYVUi0TFoMbkY-sitDCL2zS21ePvQb9e0') // 1. Generate a new key pair

// Request Permission of Notifications
messaging.requestPermission().then(() => {
  console.log('Notification permission granted.')

  // Get Token
  messaging.getToken().then((token) => {
    console.log(token)
  })
}).catch((err) => {
  console.log('Unable to get permission to notify.', err)
})

messaging.onMessage(function (payload) {
  console.log('Message received. ', payload)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
