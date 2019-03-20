<template>
  <v-app class="primary">
    <v-content :class="toolbarConf">
      <router-view/>
    </v-content>

    <TheNavbar v-if="this.view !== 'login'"/>
    <transition name="spinner">
      <AppSpinner v-show="showAppSpinner"/>
    </transition>
  </v-app>
</template>

<script>
// eslint-disable-next-line
import { format, getISODay, isToday, isSameDay, isThisWeek, isSameWeek, getISOWeek, getTime, addDays, differenceInCalendarWeeks, differenceInSeconds, endOfToday, endOfMinute } from 'date-fns'
import { getStringFromIsoDay } from '@/utils'
import { EventBus } from '@/bus'
import TheNavbar from '@/components/TheNavbar'
import { mapState, mapGetters, mapActions } from 'vuex'
// eslint-disable-next-line
import Vue from 'vue'
// eslint-disable-next-line
import firebase from 'firebase'
import AppSpinner from '@/components/AppSpinner.vue'

export default {
  name: 'App',
  data () {
    return {
      showAppSpinner: true,
      authUser: null,
      toolbarConf: 'toolbarNone',
      view: 'login',
      logged: false,
      isoDay: null,
      isoWeek: null
    }
  },
  components: {
    TheNavbar,
    AppSpinner
  },
  computed: {
    ...mapState({
      profile: state => state.profile,
      tasks: state => state.tasks,
      time: state => state.time,
      utility: state => state.utility
    }),
    ...mapGetters({
      'userData': 'profile/getProfileData'
    })
  },
  watch: {
    '$route': {
      immediate: true,
      handler (newVal, oldVal) {
        // Set proper UI padding-top depending on views
        if (this.$route.path === '/tasks') {
          this.toolbarConf = 'toolbarTasks'
        } else if (this.$route.path === '/stats') {
          this.toolbarConf = 'toolbarStats'
        } else {
          this.toolbarConf = 'toolbarNone'
        }
        if (this.$route.path === '/') {
          // Start page
          this.view = 'login'
        } else {
          this.view = 'inApp'
        }
      }

    }
  },
  methods: {
    ...mapActions({
      fetchProfileDatas: 'profile/fetchProfileDatas',
      updateProfile: 'profile/updateProfile',
      recordWeekScore: 'profile/recordWeekScore',
      updateCurrentUserWeek: 'time/updateCurrentUserWeek',
      updateTime: 'time/updateTime',
      incrementAddedDays: 'utility/incrementAddedDays',
      appReady: 'utility/appReady',
      tasksReady: 'utility/tasksReady',
      fetchTasksDatas: 'tasks/fetchTasksDatas',
      updateTask: 'tasks/updateTask',
      deleteTask: 'tasks/deleteTask',
      rebootWeeklyTasksCompletions: 'tasks/rebootWeeklyTasksCompletions',
      updateTasksCompletionsHistory: 'tasks/updateTasksCompletionsHistory'
    }),
    globalUpdate (addedDays = 0) {
      // GLOBAL UPDATES
      console.log('globalUpdate')
      console.log('addedDays = ' + addedDays)

      const isThisWeekCustom = isSameWeek(
        addDays(new Date(Date.now()), addedDays),
        new Date(this.userData.connexionDateLast),
        { weekStartsOn: 1 }
      )

      const isTodayCustom = isSameDay(
        addDays(new Date(Date.now()), addedDays),
        new Date(this.userData.connexionDateLast)
      )

      // Set currentUserWeek
      const lastUserRecordedWeek = parseInt(Object.keys(this.userData.stats.weeksRecords).slice(-1).join('').substr(1))
      const getWeeksPassedSinceLastConnexion = differenceInCalendarWeeks(
        addDays(new Date(Date.now()), addedDays),
        new Date(this.userData.connexionDateLast),
        { weekStartsOn: 1 }
      )
      const currentUserWeek = parseInt(lastUserRecordedWeek + getWeeksPassedSinceLastConnexion)
      console.log('currentUserWeek from globalUpdate = ' + currentUserWeek)
      EventBus.$emit('updateCurrentUserWeek', currentUserWeek)

      // WEEK RESET
      // Wipe current tasks completions & delete singles
      if (!isThisWeekCustom) {
        console.log('not the same week')
        // Wipe current tasks completions
        this.rebootWeeklyTasksCompletions()
        // Delete singles
        Object.entries(this.tasks)
          .filter(task => {
            return task[1].schedule.periodicity === 'Once' && task[1].schedule.once === 'single'
          })
          .forEach(task => {
            this.deleteTask(task[0])
          })
      }

      // Save current completions to tasks completions history
      if (!isTodayCustom) {
        EventBus.$emit('recordProgress')
        const currentUserWeek = this.time.currentUserWeek
        console.log('currentUserWeek from !isTodayCustom =' + currentUserWeek)

        const isoDay = this.time.isoDay
        let weekChange

        if (!isThisWeekCustom) {
          weekChange = true
        } else {
          weekChange = false
        }

        this.updateTasksCompletionsHistory({ currentUserWeek, isoDay, weekChange })
      }

      const isoDay = this.time.isoDay
      this.updateTasksCompletionsHistory({ currentUserWeek, isoDay })

      // Check reset & guards
      const copiedTasks = JSON.parse(JSON.stringify(this.tasks))
      // Loop
      for (let [key, value] of Object.entries(copiedTasks)) {
        // Weeklies commons
        if (value.schedule.periodicity === 'Weekly' ||
        value.schedule.periodicity === 'On specific days') {
          // Reset checks if a new week has started
          if (!isThisWeekCustom) {
            value.checked = false
          }
        }

        // Weekly
        if (value.schedule.periodicity === 'Weekly') {
          if (value.schedule.weekly === 'Everyday') {
          // Everyday
            // Reset check if last connexion date is not today
            if (!isTodayCustom) {
              value.checked = false
              if (value.subtasks) {
                for (let subStatus of Object.values(value.subtasks)) {
                  subStatus.checked = null
                }
              }
            }
          } else {
            // all x 'n' times
            // Reset check if last connexion date is not today & if there are free slots remaining
            if (!isTodayCustom) {
              if (value.completion.includes(0)) {
                value.checked = false
                for (let subStatus of Object.values(value.subtasks)) {
                  subStatus.checked = null
                }
              }
            }
          }
        }

        // Specific days
        if (value.schedule.periodicity === 'On specific days') {
          // Disable check by default
          value.disabled = true

          const isoDay = getISODay(addDays(new Date(Date.now()), this.utility.addedDays))
          if (value.schedule.specificDays.indexOf(getStringFromIsoDay(isoDay)) >= 0) {
            // Enable check if today is a specified day
            value.disabled = false
          }

          // Reset check if last connexion date is not today & if there are free slots remaining
          if (!isTodayCustom) {
            if (value.completion.includes(0)) {
              value.checked = false
              for (let subStatus of Object.values(value.subtasks)) {
                subStatus.checked = null
              }
            }
          }
        } else {
          value.disabled = false
        }

        const taskId = JSON.parse(JSON.stringify(key))
        const task = JSON.parse(JSON.stringify(value))
        this.updateTask({ taskId, task })
      }

      // Update connexionDateLast
      this.userData.connexionDateLast = Number(format(new Date(addDays(new Date(Date.now()), addedDays)), 'x'))
      this.updateProfile(this.userData)

      EventBus.$emit('recordProgress')
    },
    calcWeeklyCompletion () {
      console.log('calcWeeklyCompletion')

      // Filter weekly tasks from tasks
      const weeklyTasks = Object.values(this.tasks)
        .filter(task => {
          return task.schedule.periodicity === 'Weekly' ||
                  task.schedule.periodicity === 'On specific days' ||
                  (task.schedule.periodicity === 'Once' && task.schedule.once === 'single')
        })

      // Distribute tasks value
      const taskValue = 100 / weeklyTasks.length

      let total = 0
      let totalCompletions = 0

      // Distribute completion slots values
      Object.entries(weeklyTasks)
        .forEach(v => {
          const completionLength = v[1].completion.length
          const completionValue = taskValue / completionLength
          const countCompletionsDone = Object.entries(v[1].completion)
            .filter(completion => { return completion[1] === 1 })
            .length

          totalCompletions += completionValue * countCompletionsDone
          if (totalCompletions > 100) {
            totalCompletions = 100
          }
        })

      // Set weekProgress value
      total = Math.trunc(totalCompletions)
      if (isNaN(total)) { total = 0 }

      // Update store
      const progressWeek = total

      const currentUserWeek = this.time.currentUserWeek
      console.log('currentUserWeek from calcDailyCompletion = ' + currentUserWeek)

      this.recordWeekScore({ progressWeek, currentUserWeek })

      // Hide spinner
      EventBus.$emit('appSpinner', false)
    },
    simulateNextDay () {
      console.log('NEXT DAY')
      this.incrementAddedDays()
      this.globalUpdate(this.utility.addedDays)
    }
  },
  created () {
    // Helper for last connexion date :
    // console.log(format(new Date(2019, 0, 18, 11, 45, 5, 123), 'DD/MM/YYYY'))
    // console.log(getTime(new Date(2019, 0, 18, 11, 45, 5, 123)))

    // EVENTS

    const dailyCountdown = () => {
      // Minute helper -> testOnly
      // const myEndOfDay = endOfMinute(new Date(Date.now()))

      // Vars
      const myEndOfDay = endOfToday()
      const resultDiffSeconds = differenceInSeconds(
        new Date(Date.now()),
        myEndOfDay
      )
      // Countdown
      let timeLeft = Math.abs(resultDiffSeconds)
      var countdown = setInterval(() => {
        timeLeft--
        if (timeLeft <= 0) {
          clearInterval(countdown)
          this.globalUpdate()
          dailyCountdown()
        }
      }, 1000)
    }
    dailyCountdown()

    // Spinner
    EventBus.$on('appSpinner', (status) => {
      this.showAppSpinner = status
    })

    // globalUpdate
    EventBus.$on('globalUpdate', () => {
      this.globalUpdate(this.utility.addedDays)
    })

    // updateCurrentUserWeek
    EventBus.$on('updateCurrentUserWeek', (currentUserWeek) => {
      this.updateCurrentUserWeek(currentUserWeek)
    })

    // recordProgress
    EventBus.$on('recordProgress', () => {
      // Set date
      const isoDay = getISODay(addDays(new Date(Date.now()), this.utility.addedDays))
      const isoWeek = getISOWeek(addDays(new Date(Date.now()), this.utility.addedDays))
      this.updateTime({ isoDay, isoWeek })
      // Do calculations
      this.calcWeeklyCompletion()
    })

    // FIREBASE

    // Initial feed
    EventBus.$on('initFirebase', () => {
      console.log('initFirebase')

      // Firebase offline capabilities test

      // Firebase State connection
      // var connectedRef = firebase.database().ref('.info/connected')
      // connectedRef.on('value', function (snap) {
      //   if (snap.val() === true) {
      //     alert('connected')
      //   } else {
      //     alert('not connected')
      //   }
      // })

      firebase.firestore()
        .collection('users')
        .doc(this.utility.authUserID)
        .get()
        .then(doc => {
          if (doc.exists) {
            // User exists
            console.log('User exists')

            // Fetch profile datas
            this.fetchProfileDatas(this.utility.authUserID)
              .then(res => {
                console.log('firebase fetchProfileDatas + vuex update done')
                // Fetch tasks datas
                this.fetchTasksDatas(this.utility.authUserID)
                  .then((res) => {
                    console.log('firebase fetchTasksDatas + vuex update done')
                    this.appReady()
                    this.tasksReady()
                    this.globalUpdate()
                  })
              }).catch(res => {
                console.log('fetchTasksDatas echec')
                console.log(res)
              })
          } else {
            // Create new user
            console.log('User doesnt exist yet')

            // Init connexionDateLast to current time
            this.userData.connexionDateLast = Date.now()

            this.updateProfile(this.userData).then(() => {
              console.log('profileUpdated')

              // Push initial profile object
              firebase.firestore().collection('users').doc(this.utility.authUserID)
                .set({ profile: this.profile })
                .then(() => {
                  console.log('early profile node basically created')
                  this.appReady()
                  this.tasksReady()
                  this.globalUpdate()
                })
                .catch(error => {
                  console.error('Error adding document: ', error)
                })

              // Push initial profile object
              // firebase.database().ref('users').child(this.utility.authUserID)
              //   .set({ profile: this.profile })
              //   .then(user => {
              //     console.log('early profile node basically created')
              //     this.appReady()
              //     this.tasksReady()
              //     this.globalUpdate()
              //   })
            })
          }
        })
    })

    // Firebase Updates
    EventBus.$on('updateFirebase', (avatarImageRaw) => {
      console.log('updateFirebase')

      firebase.firestore().collection('users').doc(this.utility.authUserID)
        .set({ profile: this.profile, tasks: this.tasks })
        .then(() => {
          console.log('CYCLE DONE ! : firebase profile + tasks updated')
          if (this.utility.signUpProcess) {
            console.log('signup process = true, signout')
            EventBus.$emit('signOut')
          }
        })

      // firebase.database()
      //   .ref('users')
      //   .child(this.utility.authUserID)
      //   .set({ profile: this.profile, tasks: this.tasks })
      //   .then(() => {
      //     console.log('CYCLE DONE ! : firebase profile + tasks updated')
      //     if (this.utility.signUpProcess) {
      //       console.log('signup process = true, signout')
      //       EventBus.$emit('signOut')
      //     }
      //   })
    })
  }
}

</script>

<style lang="scss">
// Mixins
@include btnFabCustom;

#app {
  font-family: "Signika", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  // Max to tablet view
  //max-width: 992px;
  margin: auto;
}
.toolbarNone {
  padding-top: 0px !important;
}
.toolbarTasks {
  // toolbar(135px) + statusbar (40px)
  padding-top: calc(135px + 50px) !important;
}
.toolbarStats {
  padding-top: 40px !important;
}
.simulation {
  z-index: 200;
}

.spinner-enter-active,
.spinner-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.spinner-enter,
.spinner-leave-to {
  opacity: 0;
}
</style>
