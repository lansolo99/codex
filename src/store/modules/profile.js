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
      isoWeek,
      total
    }) {
      commit('recordWeekScore', {
        isoWeek,
        total
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
      isoWeek,
      total
    }) {
      Vue.set(state.wrapper.stats.weeksRecords, isoWeek, total)
    }
  }
}
