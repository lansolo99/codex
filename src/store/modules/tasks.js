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
      subtaskId,
      checkTime,
      completionIndex,
      completionValue
    }) {
      commit('setCheckedStatus', {
        taskId,
        checkstatus,
        taskType,
        subtaskId,
        checkTime,
        completionIndex,
        completionValue
      })
    },
    deleteTask ({
      commit
    }, payload) {
      commit('deleteTask', payload)
    },
    rebootWeeklyTasksCompletions ({
      commit
    }, payload) {
      commit('rebootWeeklyTasksCompletions', payload)
    },
    updateTasksCompletionsHistory ({
      commit
    }, payload) {
      commit('updateTasksCompletionsHistory', payload)
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
    setCheckedStatus (
      state, {
        taskId,
        checkstatus,
        taskType,
        subtaskId,
        checkTime,
        completionIndex,
        completionValue
      }
    ) {
      const task = state[taskId]
      console.log('completionValue' + completionValue)

      if (taskType === 'task') {
        // TASK
        console.log('tasktype : task')

        task.completion[completionIndex] = completionValue
        task.checked = checkstatus
        task.checkTime = checkTime
      } else {
        // SUBTASK
        console.log('tasktype : subtask')

        const subtask = state[taskId].subtasks.find(sub => {
          return sub.id === subtaskId
        })
        subtask.checked = checkstatus
        subtask.checkTime = checkTime
        // set checked status for parent task
        const allSubtasksChecked = Object.values(state[taskId].subtasks).every(
          v => {
            return v.checked
          }
        )

        if (allSubtasksChecked) {
          console.log('all subtask checked')
          task.checked = true
          task.completion[completionIndex] = completionValue
          task.checkTime = checkTime
        } else {
          console.log('not all subtasks checked')
          if (task.checked === true) {
            task.checked = false
            task.completion[completionIndex] = 0
          }
        }
      }
    },
    deleteTask (state, payload) {
      Vue.delete(state, payload)
    },
    rebootWeeklyTasksCompletions (state, payload) {
      // Filter weekly tasks only (after)
      for (let value of Object.values(state)) {
        const newCompletionArray = []
        value.completion.forEach((v, i) => {
          newCompletionArray.push(0)
        })
        value.completion = newCompletionArray
      }
    },
    updateTasksCompletionsHistory (state, payload) {
      Object.values(state).forEach(task => {
        let currentTaskCompletion = task.completion
        let formattedIsoWeek = 'W' + payload
        Vue.set(task.completionsHistory, formattedIsoWeek, currentTaskCompletion)
      })
    }
  }
}
