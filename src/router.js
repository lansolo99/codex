import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Tasks from './views/Tasks.vue'
import Stats from './views/Stats.vue'
import Profile from './views/Profile.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: Tasks
  },
  {
    path: '/stats',
    name: 'stats',
    component: Stats
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile
  }
  ]
})
