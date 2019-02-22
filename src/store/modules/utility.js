export default {
  namespaced: true,
  state: {
    authUserID: 'userid1',
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
