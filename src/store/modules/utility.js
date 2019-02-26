export default {
  namespaced: true,
  state: {
    authUserID: 'userid1',
    appReady: false,
    tasksReady: false,
    periodicities: {
      id1: {
        name: 'Weeklies'
      }
    },
    currentTask: {
      id: 'new'
    },
    dialogTask: 'false',
    dialogProfile: 'false',
    taskPanels: [null, null, null, null],
    reboot: false,
    addedDays: 0
  },
  getters: {},
  actions: {
    fetchUser ({
      commit
    }) {
      //
    },
    appReady ({
      commit
    }) {
      commit('appReady')
    },
    tasksReady ({
      commit
    }) {
      // setTimeout(function () {
      //   commit('tasksReady')
      // }, 1000)
      commit('tasksReady')
    },
    incrementAddedDays ({
      commit
    }) {
      commit('incrementAddedDays')
    },
    toggleTaskDialog ({
      commit
    }, payload) {
      commit('toggleTaskDialog', payload)
    },
    toggleProfileDialog ({
      commit
    }, payload) {
      commit('toggleProfileDialog', payload)
    },
    setCurrentTask ({
      commit
    }, payload) {
      commit('setCurrentTask', payload)
    }
  },
  mutations: {
    appReady (state) {
      console.log('appReady')
      state.appReady = true
    },
    tasksReady (state) {
      console.log('tasksReady')
      state.tasksReady = true
    },
    incrementAddedDays (state) {
      state.addedDays += 1
    },
    toggleTaskDialog (state, payload) {
      state.dialogTask = payload
    },
    toggleProfileDialog (state, payload) {
      state.dialogProfile = payload
    },
    setCurrentTask (state, payload) {
      state.currentTask.id = payload
    }

  }
}
