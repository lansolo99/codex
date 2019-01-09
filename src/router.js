import Vue from 'vue'
import Router from 'vue-router'
import Tasks from './views/Tasks.vue'
import Stats from './views/Stats.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'tasks',
    component: Tasks
  },
  {
    path: '/stats',
    name: 'stats',
    component: Stats
  }
  ]
})
