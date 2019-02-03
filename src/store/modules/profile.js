import sourceData from '@/data'

export default {
  namespaced: true,
  state: sourceData.profile,
  getters: {
    getProfileData (state) {
      return state.profile
    }
  },
  actions: {
    updateProfile ({
      commit
    }, payload) {
      commit('updateProfile', payload)
    }
  },
  mutations: {
    updateProfile (state, payload) {
      console.log(payload)
      state = payload
    }
  }
}
