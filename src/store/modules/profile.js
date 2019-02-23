import Vue from 'vue'
import firebase from 'firebase'
import sourceData from '@/data'

export default {
  namespaced: true,
  state: sourceData.profile,
  // state: {},
  getters: {
    getProfileData (state) {
      const retrievedUserData = {
        ...state
      }
      return retrievedUserData
    }
  },
  actions: {
    fetchProfileDatas ({
      commit
    }, authUserID) {
      console.log('fetchProfileDatas')
      return new Promise((resolve, reject) => {
        firebase.database()
          .ref('users')
          .child(authUserID)
          .child('profile')
          .once('value', snapshot => {
            console.log(snapshot.val())
            commit('updateProfile', snapshot.val())
            resolve('yes')
            // this.updateProfile(snapshot.val())
          })
      })
    },
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
      Object.assign(state, payload)
      // Vue.set(state, 'profile', payload)
    },
    disableFirstTimeUser (state) {
      state.firstTime = false
    },
    recordProgress (state, {
      progressToday,
      isoDay
    }) {
      state.stats.progressToday = progressToday
    },
    recordWeekScore (state, {
      progressWeek,
      currentUserWeek
    }) {
      state.stats.progressWeek = progressWeek
      Vue.set(state.stats.weeksRecords, currentUserWeek, progressWeek)
    }
  }
}
