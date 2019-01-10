import Vue from 'vue'
import Vuex from 'vuex'
import sourceData from '@/data'

Vue.use(Vuex)
console.log(sourceData)

export default new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  state: sourceData,
  getters: {
    allTasks: (state) => {
      return Object.values(state.tasks)[1]['title']
    }
  },
  actions: {
    addNewTask ({
      commit
    }, payload) {
      commit('addNewTask', payload)
    }
  },
  mutations: {
    addNewTask (state, payload) {
      const task = payload
      const taskId = 'newTask' + parseInt(Math.random() * 1000)
      Vue.set(state.tasks, taskId, task)
    }
  }

})
