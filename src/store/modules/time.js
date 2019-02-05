import startOfDay from 'date-fns/start_of_day'
export default {
  namespaced: true,
  state: {
    now: new Date()
  },
  getters: {
    today (state) {
      return startOfDay(state.now)
    }
  },
  actions: {
    start ({
      commit
    }) {
      setInterval(() => {
        commit('updateTime')
      }, 1000 * 60)
    }
  },
  mutations: {
    updateTime (state) {
      state.now = new Date()
    }
  }
}
