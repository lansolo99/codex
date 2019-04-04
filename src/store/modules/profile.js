import Vue from 'vue'
import firebase from '@/Firebase'
import sourceData from '@/store/datas/profile'
import defaultStats from '@/store/datas/profileDefaultStats'
import {
  EventBus
} from '@/bus'

const getDefaultState = {
  ...sourceData
}

const getDefaultStats = {
  ...defaultStats
}

export default {
  namespaced: true,
  state: sourceData,
  getters: {
    getProfileData (state) {
      // return state
      const retrievedUserData = {
        ...state
      }
      return retrievedUserData
    }
  },
  actions: {
    addUserToken ({
      commit
    }, payload) {
      commit('addUserToken', payload)
    },
    setResetProfileProgression ({
      commit
    }) {
      commit('setResetProfileProgression')
    },
    resetProfileDatas ({
      commit
    }) {
      commit('resetProfileDatas')
    },
    fetchProfileDatas ({
      commit
    }, authUserID) {
      return new Promise((resolve, reject) => {
        firebase.firestore()
          .collection('users')
          .doc(authUserID)
          .get()
          .then(doc => {
            commit('updateProfile', doc.data().profile)
            resolve()
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
    updateDayScore ({
      commit
    }, {
      progressToday,
      countDailyTasks,
      countCheckedTasks
    }) {
      console.log('progressToday from profile store = ' + progressToday)

      commit('updateDayScore', {
        progressToday,
        countDailyTasks,
        countCheckedTasks
      })
    },
    recordWeekScore ({
      commit,
      dispatch,
      rootState
    }, {
      progressWeek,
      currentUserWeek
    }) {
      const authUserID = rootState.utility.authUserID
      commit('recordWeekScore', {
        progressWeek,
        currentUserWeek,
        authUserID
      })
    }
  },
  mutations: {
    updateUserTimeZone (state, payload) {
      console.log(payload)
      state.notifications.timezone = payload
    },
    addUserToken (state, payload) {
      Vue.set(state.notifications, 'token', payload)
    },
    resetProfileDatas (state) {
      Object.assign(state, getDefaultState)
    },
    updateProfile (state, payload) {
      return new Promise((resolve, reject) => {
        Object.assign(state, payload)
        resolve()
      })
    },
    disableFirstTimeUser (state) {
      state.firstTime = false
    },
    updateDayScore (state, {
      progressToday,
      countDailyTasks,
      countCheckedTasks
    }) {
      console.log('progressToday from profile store mutation = ' + progressToday)
      Vue.set(state.stats.dayScore, 'score', progressToday)
      Vue.set(state.stats.dayScore, 'checked', countCheckedTasks)
      Vue.set(state.stats.dayScore, 'total', countDailyTasks)
    },
    setResetProfileProgression (state) {
      state.connexionDateLast = Number(new Date(Date.now()))
      state.avatarImage = ''
      Object.assign(state.stats, getDefaultStats)
    },
    recordWeekScore (state, {
      progressWeek,
      currentUserWeek,
      authUserID
    }) {
      Vue.set(state.stats, 'progressWeek', progressWeek)
      const weekKey = 'W' + currentUserWeek.toString()
      Vue.set(state.stats.weeksRecords, weekKey, progressWeek)
      console.log('authUserID =' + authUserID)

      return authUserID === 'guest' ? '' : EventBus.$emit('updateFirebase')
    }
  }
}
