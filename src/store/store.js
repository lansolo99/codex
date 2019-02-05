import Vue from 'vue'
import Vuex from 'vuex'
import tasks from '@/store/modules/tasks'
import profile from '@/store/modules/profile'
import utility from '@/store/modules/utility'
import time from '@/store/modules/time'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    tasks,
    profile,
    utility,
    time
  },
  state: {},
  getters: {},
  actions: {},
  mutations: {}
})
