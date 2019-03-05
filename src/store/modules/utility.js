export default {
  namespaced: true,
  state: {
    authUserID: null,
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
  actions: {
    setUser ({
      commit
    }, payload) {
      console.log(payload)

      commit('setUser', payload)
    },
    appReady ({
      commit
    }) {
      commit('appReady')
    },
    tasksReady ({
      commit
    }) {
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
    setUser (state, payload) {
      console.log('setUser')
      state.authUserID = payload
    },
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
