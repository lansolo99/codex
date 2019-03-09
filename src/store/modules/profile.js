import Vue from 'vue'
import firebase from 'firebase'
import sourceData from '@/store/datas/profile'
import {
  EventBus
} from '@/bus'

const getDefaultState = {
  ...sourceData
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
    resetProfileDatas ({
      commit
    }) {
      commit('resetProfileDatas')
    },
    fetchProfileDatas ({
      commit
    }, authUserID) {
      return new Promise((resolve, reject) => {
        firebase.database()
          .ref('users')
          .child(authUserID)
          .child('profile')
          .once('value', snapshot => {
            commit('updateProfile', snapshot.val())
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
      console.log(payload)
      commit('updateProfile', payload)
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
    recordWeekScore (state, {
      progressWeek,
      currentUserWeek,
      authUserID
    }) {
      Vue.set(state.stats, 'progressWeek', progressWeek)
      const weekKey = 'W' + currentUserWeek.toString()
      Vue.set(state.stats.weeksRecords, weekKey, progressWeek)
      return authUserID === 'guest' ? '' : EventBus.$emit('updateFirebase')
    }
  }
}
