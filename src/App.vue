<template>
  <v-app class="primary">
    <v-content :class="toolbarConf">
      <router-view />
    </v-content>

    <TheNavbar v-if="this.view !== 'login'" />
    <transition name="spinner">
      <AppSpinner v-show="showAppSpinner" />
    </transition>

    <!-- Inform user notification to subscription has been deleted -->
    <Dialog
      :vmodel="dialogUnsubscribeNotification"
      title="Notification subscription"
      color="primary"
      :closeIcon="true"
      @closeDialog="dialogUnsubscribeNotification = false"
    >
      <template v-slot:body>
        Welcome back {{userData.pseudo}}!
        <div class="mt-2">
          Just to inform you that your subscription to notifications reminder has been suspended because you might have changed your device.
          To get it back, just reactivate it from your profile page.
        </div>
      </template>
    </Dialog>
  </v-app>
</template>

<script>
// eslint-disable-next-line
import { format, getISODay, isSameDay, isSameWeek, getISOWeek, addDays, differenceInCalendarWeeks, differenceInSeconds, endOfToday } from 'date-fns'
import { getStringFromIsoDay } from '@/utils'
import { EventBus } from '@/bus'
import TheNavbar from '@/components/TheNavbar'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import firebase from './Firebase'
import AppSpinner from '@/components/AppSpinner.vue'
import Dialog from '@/components/Dialog'

export default {
  name: 'App',
  data () {
    return {
      userResignIn: false,
      dialogUnsubscribeNotification: false,
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
    AppSpinner,
    Dialog
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
      addUserToken: 'profile/addUserToken',
      updateProfile: 'profile/updateProfile',
      updateDayScore: 'profile/updateDayScore',
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
    ...mapMutations({
      updateUserTimeZone: 'profile/updateUserTimeZone',
      updateUserDeviceId: 'profile/updateUserDeviceId'
    }),
    globalUpdate (addedDays = 0) {
      /* =============================================
                     GLOBAL UPDATES
      ============================================= */

      console.log('globalUpdate')
      // console.log('addedDays = ' + addedDays)

      // Utils
      const isThisWeekCustom = isSameWeek(
        addDays(new Date(Date.now()), addedDays),
        new Date(this.userData.connexionDateLast),
        { weekStartsOn: 1 }
      )
      const isTodayCustom = isSameDay(
        addDays(new Date(Date.now()), addedDays),
        new Date(this.userData.connexionDateLast)
      )

      // Set current user time zone
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      this.updateUserTimeZone(userTimeZone)

      // Set currentUserWeek
      const lastUserRecordedWeek = parseInt(Object.keys(this.userData.stats.weeksRecords).slice(-1).join('').substr(1))
      const getWeeksPassedSinceLastConnexion = differenceInCalendarWeeks(
        addDays(new Date(Date.now()), addedDays),
        new Date(this.userData.connexionDateLast),
        { weekStartsOn: 1 }
      )
      const currentUserWeek = parseInt(lastUserRecordedWeek + getWeeksPassedSinceLastConnexion)
      // console.log('currentUserWeek from globalUpdate = ' + currentUserWeek)
      EventBus.$emit('updateCurrentUserWeek', currentUserWeek)

      // WEEK RESET
      // Wipe current tasks completions & delete singles
      if (!isThisWeekCustom) {
        // console.log('not the same week')
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
    calcDailyCompletion () {
      console.log('calcDailyCompletion')

      // todayProgress value is based on everydays + all specific days + singles

      // Filter daily (due today) tasks from tasks
      const dailyTasks = Object.values(this.tasks)
        .filter(task => {
          return (task.schedule.periodicity === 'Weekly' &&
        task.disabled === false) ||
        (task.schedule.periodicity === 'On specific days' &&
        task.schedule.specificDays.find(v => { return v === getStringFromIsoDay(this.time.isoDay) })) ||
        (task.schedule.periodicity === 'Once' &&
        task.schedule.once === 'single')
        })

      // Distribute tasks value
      const countDailyTasks = dailyTasks.length
      const taskValue = 100 / countDailyTasks

      let total = 0
      let totalSubtasks = 0

      // Count checked
      const countCheckedTasks = Object.entries(dailyTasks)
        .filter(v => { return v[1].checked === true })
        .length

      // Distribute subtasks values
      Object.entries(dailyTasks)
        .filter(v => { return v[1].checked === false && v[1].subtasks.length > 0 })
        .forEach(v => {
          const subtaskLength = v[1].subtasks.length
          const subtaskValue = taskValue / subtaskLength
          const countSubtasksChecked = Object.entries(v[1].subtasks)
            .filter(sub => { return sub[1].checked === true })
            .length
          totalSubtasks += subtaskValue * countSubtasksChecked
        })

      // Set todayProgress value
      total = Math.trunc((taskValue * countCheckedTasks) + totalSubtasks)
      if (isNaN(total)) { total = 0 }

      // Update data
      const progressToday = total
      this.updateDayScore({ progressToday, countDailyTasks, countCheckedTasks })
    },
    calcWeeklyCompletion () {
      // Filter weekly tasks from tasks
      const weeklyTasks = Object.values(this.tasks)
        .filter(task => {
          return task.schedule.periodicity === 'Weekly' ||
                  (task.schedule.periodicity === 'On specific days' && task.completion.length !== 0) ||
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

    /* =============================================
                FIREBASE CLOUD MESSAGING
    ============================================= */

    if (firebase.messaging.isSupported()) {
      console.log('firebase messaging supported')

      const messaging = firebase.messaging()
      // Add the public key generated from the console here.
      messaging.usePublicVapidKey('BMZ27Tax1A9db5QrZpnHVs7mIUJS8walNQrElirXRA6B11i-t_I0INmYVUi0TFoMbkY-sitDCL2zS21ePvQb9e0')
      // On receive message in the browser
      messaging.onMessage(function (payload) {
        console.log('Message received. ', payload)
        console.log('body = ' + payload.data.body)
      // ...
      })
    }

    /* =============================================
                        EVENTS
    ============================================= */

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
      this.calcDailyCompletion()
      this.calcWeeklyCompletion()
    })

    /* =============================================
                       FIREBASE
    ============================================= */

    // Initial feed
    EventBus.$on('initFirebase', () => {
      console.log('initFirebase')

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
                console.log('fetchProfileDatas done')

                // Notification subscriptions
                // Case 1 : user has no token -> do nothing
                // Case 2 : user has token -> check current registration token -> same ? do nothing : delete token
                if (this.profile.notifications.token !== '') {
                  console.log('token found')

                  if (firebase.messaging.isSupported()) {
                    const messaging = firebase.messaging()
                    messaging.getToken().then((currentToken) => {
                      if (currentToken) {
                        if (currentToken !== this.profile.notifications.token) {
                          console.log('currentToken IS NOT the same => delete token')
                          // Delete token (UI)
                          const currentToken = ''
                          const userStatus = false
                          this.addUserToken({ currentToken, userStatus }).then(() => {
                            this.userResignIn = true
                          })
                        } else {
                          console.log('currentToken IS the same => doing nothing')
                        }
                      } else {
                      }
                    }).catch(error => {
                      console.log('An error occurred while retrieving token. ', error)
                    })
                  }
                }

                // Fetch tasks datas
                this.fetchTasksDatas(this.utility.authUserID)
                  .then((res) => {
                    console.log('fetchTasksDatas done')
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
            this.userData.connexionDateLast = Number(Date.now())
            // Init subscription date
            this.userData.registrationDate = Number(Date.now())

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
            })
          }
        })
    })

    // Firebase Updates
    EventBus.$on('updateFirebase', (context) => {
      firebase.firestore().collection('users').doc(this.utility.authUserID)
        .set({ profile: this.profile, tasks: this.tasks })
        .then(() => {
          console.log('Firebase updated')

          if (context === 'signOut') {
            EventBus.$emit('signOut')
            this.$router.push({ name: 'login' })
          } else if (this.userResignIn === true) {
            this.dialogUnsubscribeNotification = true
            this.userResignIn = false
          }
        })
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
  @include responsive(desktopscreens) {
    margin: auto;
    max-width: 375px;
  }
}
.toolbarNone {
  padding-top: 0px !important;
}
.toolbarTasks {
  padding-top: calc(135px + 38px) !important;
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
