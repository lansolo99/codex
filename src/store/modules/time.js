import {
  getISODay,
  getISOWeek
} from 'date-fns'

export default {
  namespaced: true,
  state: {
    isoDay: getISODay(Date.now()),
    isoWeek: getISOWeek(Date.now()),
    currentUserWeek: null
  },
  getters: {},
  actions: {
    updateCurrentUserWeek ({
      commit
    }, payload) {
      commit('updateCurrentUserWeek', payload)
    },
    updateTime ({
      commit
    }, {
      isoDay,
      isoWeek
    }) {
      commit('updateTime', {
        isoDay,
        isoWeek
      })
    }
  },
  mutations: {
    updateCurrentUserWeek (state, payload) {
      state.currentUserWeek = payload
    },
    updateTime (state, {
      isoDay,
      isoWeek
    }) {
      state.isoDay = isoDay
      state.isoWeek = isoWeek
    }
  }
}
