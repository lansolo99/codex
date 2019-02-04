import Vue from 'vue'
import sourceData from '@/data'

export default {
  namespaced: true,
  state: sourceData.profile,
  getters: {
    getProfileData (state) {
      const retrievedUserData = JSON.parse(JSON.stringify(state.wrapper))
      return retrievedUserData
    }
  },
  actions: {
    disableFirstTimeUser ({
      commit
    }) {
      commit('disableFirstTimeUser')
    },
    updateProfile ({
      commit
    }, payload) {
      commit('updateProfile', payload)
    }
  },
  mutations: {
    updateProfile (state, payload) {
      console.log(payload)
      Vue.set(state, 'wrapper', payload)
    },
    disableFirstTimeUser (state) {
      state.wrapper.firstTime = false
    }
  }
}
