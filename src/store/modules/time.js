import {
  getISODay,
  getISOWeek
} from 'date-fns'

export default {
  namespaced: true,
  state: {
    isoDay: getISODay(Date.now()),
    isoWeek: getISOWeek(Date.now())
  },
  getters: {},
  actions: {
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
    updateTime (state, {
      isoDay,
      isoWeek
    }) {
      state.isoDay = isoDay
      state.isoWeek = isoWeek
    }
  }
}
