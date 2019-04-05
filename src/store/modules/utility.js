import sourceData from '@/store/datas/utility'

const getDefaultState = {
  ...sourceData
}

export default {
  namespaced: true,
  state: sourceData,
  getters: {
    getCountries (state) {
      const named = state.countries.map(v => {
        return v['name']
      })
      return named
    }
  },
  actions: {
    appInstall ({
      commit
    }, {
      status,
      os
    }) {
      console.log(status)
      console.log(os)

      commit('appInstall', {
        status,
        os
      })
    },
    resetUtilityDatas ({
      commit
    }) {
      commit('resetUtilityDatas')
    },
    setUser ({
      commit
    }, payload) {
      commit('setUser', payload)
    },
    setAuthUser ({
      commit
    }, payload) {
      commit('setAuthUser', payload)
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
    appInstall (state, {
      status,
      os
    }) {
      state.appInstall = status
      state.appInstallOS = os
    },
    setDeleteAccount (state) {
      console.log('setDeleteAccount')

      state.deleteAccount = true
    },
    resetUtilityDatas (state) {
      Object.assign(state, getDefaultState)
    },
    setUser (state, payload) {
      if (payload === 'null') {
        state.authUserID = null
        state.authUserEmail = null
      } else if (payload === 'guest') {
        state.authUserID = 'guest'
        state.authUserEmail = null
      } else {
        state.authUserID = payload.uid
        state.authUserEmail = payload.email
      }
    },
    setAuthUser (state, payload) {
      if (payload === 'null') {
        state.authUser = null
      } else {
        state.authUser = payload
      }
    },
    appReady (state) {
      state.appReady = true
    },
    tasksReady (state) {
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
