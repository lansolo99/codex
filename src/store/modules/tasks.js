import Vue from 'vue'
import sourceData from '@/data'
import {
  EventBus
} from '@/bus'

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
      subtaskId,
      checkTime,
      completionIndex,
      completionValue
    }) {
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
        const allSubtasksChecked = Object.values(state[taskId].subtasks).every(v => {
          return v.checked
        })

        const defineTaskId = taskId
        let defineStatus
        const defineTaskType = 'task'

        if (allSubtasksChecked) {
          console.log('ALL SUBTASKS CHECKED !!!!!!!')

          defineStatus = true
          EventBus.$emit('updateCheckedStatus', {
            defineTaskId,
            defineStatus,
            defineTaskType
          })
        } else {
          console.log('not all subtasks checked')

          // defineStatus = false
          // EventBus.$emit('updateCheckedStatus', {
          //   defineTaskId,
          //   defineStatus,
          //   defineTaskType
          // })
          // task.checked = false
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
    }
  }
}
