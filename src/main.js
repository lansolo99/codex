import '@babel/polyfill'
import Vue from 'vue'
import firebase from 'firebase'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/store'
import {
  mapActions
} from 'vuex'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vuelidate from 'vuelidate'
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

new Vue({
  router,
  store,
  render: h => h(App),
  methods: {
    ...mapActions({
      fetchUser: 'utility/fetchUser'
    })
  },
  beforeCreate () {
    // maybe later use this
    // this.fetchUser
  }
}).$mount('#app')
