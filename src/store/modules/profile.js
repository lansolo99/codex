import Vue from 'vue'
import sourceData from '@/data'

export default {
  namespaced: true,
  state: sourceData.profile,
  getters: {
    getProfileData (state) {
      const retrievedUserData = {
        ...state.wrapper
      }
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
    },
    recordProgress ({
      commit
    }, {
      progressToday,
      isoDay
    }) {
      commit('recordProgress', {
        progressToday,
        isoDay
      })
    },
    recordWeekScore ({
      commit
    }, {
      progressWeek,
      currentUserWeek
    }) {
      commit('recordWeekScore', {
        progressWeek,
        currentUserWeek
      })
    }
  },
  mutations: {
    updateProfile (state, payload) {
      Vue.set(state, 'wrapper', payload)
    },
    disableFirstTimeUser (state) {
      state.wrapper.firstTime = false
    },
    recordProgress (state, {
      progressToday,
      isoDay
    }) {
      state.wrapper.stats.progressToday = progressToday
    },
    recordWeekScore (state, {
      progressWeek,
      currentUserWeek
    }) {
      state.wrapper.stats.progressWeek = progressWeek
      Vue.set(state.wrapper.stats.weeksRecords, currentUserWeek, progressWeek)
    }
  }
}
