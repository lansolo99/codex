import Vue from 'vue'
import Vuex from 'vuex'
import sourceData from '@/data'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: sourceData,
  getters: {
    test: state => {
      return Object.values(state.tasks)[1]['title']
    },
    getAllTasks: state => {
      return state.tasks
    }
  },
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
    toggleTaskDialog ({
      commit
    }, payload) {
      commit('toggleTaskDialog', payload)
    },
    setCurrentTask ({
      commit
    }, payload) {
      commit('setCurrentTask', payload)
    },
    deleteTask ({
      commit
    }, payload) {
      commit('deleteTask', payload)
    }
  },
  mutations: {
    addNewTask (state, payload) {
      Vue.set(state.tasks, payload.id, payload)
      console.log(state)
    },
    updateTask (state, {
      taskId,
      task
    }) {
      state.tasks[taskId] = task
    },
    setCheckedStatus (state, {
      taskId,
      checkstatus,
      taskType,
      subtaskId
    }) {
      if (taskType === 'task') {
        const task = state.tasks[taskId]
        task.checked = checkstatus
      } else {
        const subtask = state.tasks[taskId].subtasks.find(sub => {
          return sub.id === subtaskId
        })
        subtask.checked = checkstatus
        // set checked status for parent task
        const allSubtasksChecked = Object.values(state.tasks[taskId].subtasks).every(v => {
          return v.checked
        })

        if (allSubtasksChecked) {
          state.tasks[taskId].checked = true
        } else {
          state.tasks[taskId].checked = false
        }
      }
    },
    toggleTaskDialog (state, payload) {
      state.utility.dialogTask = payload
    },
    setCurrentTask (state, payload) {
      state.currentTask.id = payload
    },
    deleteTask (state, payload) {
      Vue.delete(state.tasks, payload)
    }

  }

})
