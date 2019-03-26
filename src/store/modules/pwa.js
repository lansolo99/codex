export default {
  namespaced: true,
  state: {
    appInstall: false,
    appInstallOS: null,
    installPrompt: null
  },

  actions: {
    appInstall ({
      commit
    }, {
      status,
      os,
      installPrompt
    }) {
      console.log(status)
      console.log(os)
      console.log(installPrompt)

      commit('appInstall', {
        status,
        os,
        installPrompt
      })
    }
  },
  mutations: {
    appInstall (state, {
      status,
      os,
      installPrompt
    }) {
      state.appInstall = status
      state.appInstallOS = os
      state.installPrompt = installPrompt
    }
  }
}
