import Vue from 'vue'
import Vuex from 'vuex'
import sourceData from '@/data'

Vue.use(Vuex)
console.log(sourceData)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
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
    },
    setCheckedStatus ({
      commit
    }, {
      taskId,
      checkstatus,
      taskType,
      subtaskId
    }) {
      commit('setCheckedStatus', {
        taskId,
        checkstatus,
        taskType,
        subtaskId
      })
    }
  },
  mutations: {
    addNewTask (state, payload) {
      Vue.set(state.tasks, payload.id, payload)
    },
    setCheckedStatus (state, {
      taskId,
      checkstatus,
      taskType,
      subtaskId
    }) {
      if (taskType === 'task') {
        // console.log(taskType)
        const task = state.tasks[taskId]
        task.checked = checkstatus
      } else {
        // console.log(state.tasks[taskId].subtasks)
        const subtask = state.tasks[taskId].subtasks.find(sub => {
          return sub.id === subtaskId
        })
        subtask.checked = checkstatus
        // console.log(subtask)
        // const subtask = state.tasks[taskId].subtasks[subtaskId]
        // subtask.checked = checkstatus
      }
    }

  }

})
