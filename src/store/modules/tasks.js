import Vue from 'vue'
import sourceData from '@/data'

export default {
  namespaced: true,
  state: sourceData.tasks,
  getters: {},
  actions: {
    addNewTask ({
      commit
    }, payload) {
      commit('addNewTask', payload)
    },
    updateTask ({
      commit
    }, {
      taskId,
      task
    }) {
      commit('updateTask', {
        taskId,
        task
      })
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
    },
    deleteTask ({
      commit
    }, payload) {
      commit('deleteTask', payload)
    }
  },
  mutations: {
    addNewTask (state, payload) {
      Vue.set(state, payload.id, payload)
      console.log(state)
    },
    updateTask (state, {
      taskId,
      task
    }) {
      state[taskId] = task
    },
    setCheckedStatus (state, {
      taskId,
      checkstatus,
      taskType,
      subtaskId
    }) {
      if (taskType === 'task') {
        const task = state[taskId]
        task.checked = checkstatus
      } else {
        const subtask = state[taskId].subtasks.find(sub => {
          return sub.id === subtaskId
        })
        subtask.checked = checkstatus
        // set checked status for parent task
        const allSubtasksChecked = Object.values(state[taskId].subtasks).every(v => {
          return v.checked
        })

        if (allSubtasksChecked) {
          state[taskId].checked = true
        } else {
          state[taskId].checked = false
        }
      }
    },
    deleteTask (state, payload) {
      Vue.delete(state, payload)
    }
  }
}
