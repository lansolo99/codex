export default {
  namespaced: true,
  state: {
    appInstall: false,
    appInstallOS: null
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
    }
  },
  mutations: {
    appInstall (state, {
      status,
      os
    }) {
      state.appInstall = status
      state.appInstallOS = os
    }
  }
}
