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
    resetUtilityDatas (state) {
      Object.assign(state, getDefaultState)
    },
    setUser (state, payload) {
      if (payload === 'null') {
        state.authUserID = null
        state.authUserEmail = null
      } else {
        state.authUserID = payload.uid
        state.authUserEmail = payload.email
      }
    },
    setAuthUser (state, payload) {
      console.log('setAuthUser')

      console.log(payload)

      if (payload === 'null') {
        state.authUser = null
      } else {
        state.authUser = payload
      }
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
