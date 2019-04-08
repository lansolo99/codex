import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Tasks from './views/Tasks.vue'
import Stats from './views/Stats.vue'
import Profile from './views/Profile.vue'
import goTo from 'vuetify/es5/components/Vuetify/goTo'
Vue.use(Router)
// Router
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo)
  },
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
  },
  {
    path: '/*',
    name: 'notFound',
    redirect: '/'
  }
  ]
})
