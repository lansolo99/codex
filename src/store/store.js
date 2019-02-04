import Vue from 'vue'
import Vuex from 'vuex'
import tasks from '@/store/modules/tasks'
import profile from '@/store/modules/profile'
import utility from '@/store/modules/utility'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    tasks,
    profile,
    utility
  },
  state: {},
  getters: {},
  actions: {},
  mutations: {}
})
