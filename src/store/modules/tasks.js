import Vue from 'vue'
import firebase from 'firebase'

export default {
  namespaced: true,
  state: {},
  getters: {},
  actions: {
    resetTasksDatas ({
      commit
    }) {
      commit('resetTasksDatas')
    },
    fetchTasksDatas ({
      commit
    }, authUserID) {
      return new Promise((resolve, reject) => {
        firebase
          .database()
          .ref('users')
          .child(authUserID)
          .child('tasks')
          .once('value', snapshot => {
            if (snapshot.exists()) {
              // recreate empty nodes needed
              const tasks = snapshot.val()

              Object.entries(snapshot.val()).forEach((pair, index) => {
                // Subtasks
                if (!pair[1].hasOwnProperty('subtasks')) {
                  tasks[pair[0]]['subtasks'] = []
                }
                // Specific days
                if (!pair[1]['schedule'].hasOwnProperty('specificDays')) {
                  tasks[pair[0]]['schedule']['specificDays'] = []
                }

                // Completion
                if (!pair[1].hasOwnProperty('completion')) {
                  tasks[pair[0]]['completion'] = []
                }
              })
              commit('fetchTasksDatas', tasks)
            }
            resolve()
          })
      })
    },
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
    }) {
      commit('rebootWeeklyTasksCompletions')
    },
    updateTasksCompletionsHistory ({
      commit
    }, {
      currentUserWeek,
      isoDay,
      weekChange
    }) {
      commit('updateTasksCompletionsHistory', {
        currentUserWeek,
        isoDay,
        weekChange
      })
    }
  },
  mutations: {
    resetTasksDatas (state) {
      for (let key of Object.keys(state)) {
        Vue.delete(state, key)
      }
    },
    addNewTask (state, payload) {
      Vue.set(state, payload.id, payload)
    },
    fetchTasksDatas (state, payload) {
      for (let [key, value] of Object.entries(payload)) {
        Vue.set(state, key, value)
      }
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

      if (taskType === 'task') {
        // TASK
        task.completion[completionIndex] = completionValue
        task.checked = checkstatus
        task.checkTime = checkTime
      } else {
        // SUBTASK
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
          task.checked = true
          task.completion[completionIndex] = completionValue
          task.checkTime = checkTime
        } else {
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
    rebootWeeklyTasksCompletions (state) {
      // Filter weekly tasks only
      for (let value of Object.values(state)) {
        console.log(value)

        const newCompletionArray = []
        value.completion.forEach((v, i) => {
          newCompletionArray.push(0)
        })
        value.completion = newCompletionArray
      }
    },
    updateTasksCompletionsHistory (
      state, {
        currentUserWeek,
        isoDay,
        weekChange
      }
    ) {
      Object.values(state).forEach(task => {
        // Reset completion slot (if ever sliced at init)
        if (weekChange) {
          // Slot Generator
          const slotsGenerator = n => {
            task.completion = []
            for (let i = 0; i < n; i++) {
              task.completion.push(0)
            }
          }

          // Case Weekly
          if (task.schedule.periodicity === 'Weekly') {
            switch (task.schedule.weekly) {
              case 'Everyday':
                slotsGenerator(7)
                break
              case 'x1 time':
                slotsGenerator(1)
                break
              case 'x2 times':
                slotsGenerator(2)
                break
              case 'x3 times':
                slotsGenerator(3)
                break
              case 'x4 times':
                slotsGenerator(4)
                break
              case 'x5 times':
                slotsGenerator(5)
                break
              case 'x6 times':
                slotsGenerator(6)
                break
            }
          }
          if (task.schedule.periodicity === 'On specific days') {
            slotsGenerator(task.schedule.specificDays.length)
          }
        }
        let currentTaskCompletion = JSON.parse(JSON.stringify(task.completion))
        // Fill empty week slots with "2" (heatmap purpose)
        const fillBlankCompletions = completion => {
          for (let i = completion.length; i < 7; i++) {
            completion.push(2)
          }
          return completion
        }
        const completionFilled = fillBlankCompletions(currentTaskCompletion)
        let formattedIsoWeek = 'Week ' + currentUserWeek
        Vue.set(task.completionsHistory, formattedIsoWeek, completionFilled)
      })
    }
  }
}
