<template>
  <v-app class="primary">
    <v-content :class="toolbarConf">
      <router-view/>
      <v-btn
        class="red simulation white--text"
        absolute
        bottom
        right
        @click="simulateNextDay()"
      >Next day</v-btn>
    </v-content>

    <TheNavbar/>
  </v-app>
</template>

<script>
// eslint-disable-next-line
import { format, getISODay, isToday, isSameDay, isThisWeek, isSameWeek, getISOWeek, getTime, addDays, differenceInCalendarWeeks } from 'date-fns'
import { getStringFromIsoDay } from '@/utils'
import { EventBus } from '@/bus'
import TheNavbar from '@/components/TheNavbar'
import { mapState, mapGetters, mapActions } from 'vuex'
// eslint-disable-next-line
import Vue from 'vue'
// eslint-disable-next-line
import firebase from 'firebase'

export default {
  name: 'App',
  data () {
    return {
      toolbarConf: 'toolbarTasks',
      isoDay: null,
      isoWeek: null,
      userTest: {
        name: 'myname',
        age: 29
      }
    }
  },
  components: {
    TheNavbar
  },
  computed: {
    ...mapState({
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
        if (this.$route.path === '/') {
        // Set proper UI padding if on tasks screen
          this.toolbarConf = 'toolbarTasks'
        } else {
          this.toolbarConf = 'toolbarNone'
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
      addDatas: 'tasks/addDatas',
      updateTask: 'tasks/updateTask',
      deleteTask: 'tasks/deleteTask',
      rebootWeeklyTasksCompletions: 'tasks/rebootWeeklyTasksCompletions',
      updateTasksCompletionsHistory: 'tasks/updateTasksCompletionsHistory'
    }),
    globalUpdate (addedDays = 0) {
      // GLOBAL UPDATES
      console.log('globalUpdate')

      // console.log('last connexion date = ' + format(new Date(this.userData.connexionDateLast), 'DD/MM/YYYY'))

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
      const lastUserRecordedWeek = parseInt(Object.keys(this.userData.stats.weeksRecords).slice(-1))
      const getWeeksPassedSinceLastConnexion = differenceInCalendarWeeks(
        addDays(new Date(Date.now()), addedDays),
        new Date(this.userData.connexionDateLast),
        { weekStartsOn: 1 }
      )
      const currentUserWeek = parseInt(lastUserRecordedWeek + getWeeksPassedSinceLastConnexion)
      EventBus.$emit('updateCurrentUserWeek', currentUserWeek)

      // WEEK RESET
      // Wipe current tasks completions & delete singles
      if (!isThisWeekCustom) {
        console.log('not the same week')
        // Wipe current tasks completions
        this.rebootWeeklyTasksCompletions()
        // Delete singles
        Object.values(this.tasks)
          .filter(task => {
            return task.schedule.periodicity === 'Once' && task.schedule.once === 'single'
          })
          .forEach(task => {
            this.deleteTask(task.id)
          })
      }

      // Save current completions to tasks completions history
      if (!isTodayCustom) {
        EventBus.$emit('recordProgress')
        const currentUserWeek = this.time.currentUserWeek
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
              for (let subStatus of Object.values(value.subtasks)) {
                subStatus.checked = null
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
      this.userData.connexionDateLast = addDays(new Date(Date.now()), addedDays)
      this.updateProfile(this.userData)
      // console.log('updated last connexion date = ' + format(new Date(this.userData.connexionDateLast), 'DD/MM/YYYY') + 'updated')

      EventBus.$emit('recordProgress')
    },
    calcWeeklyCompletion () {
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
      this.recordWeekScore({ progressWeek, currentUserWeek })
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

    // EVENTS DEFINTIONS

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
    this.fetchProfileDatas(this.utility.authUserID)
      .then(res => {
        console.log('fetchProfileDatas action done')
        console.log(res)
        this.globalUpdate()
      })

    // Fetch profile
    // firebase.database()
    //   .ref('users')
    //   .child(this.utility.authUserID)
    //   .child('profile')
    //   .once('value', snapshot => {
    //     console.log(snapshot.val())
    //     this.updateProfile(snapshot.val())
    //   })

    // (Try) Add new user node
    // firebase.database()
    //   .ref('users')
    //   .push(this.userTest)
    // // (Try ) Add new user node and add the generated firebase id as its own id property
    // firebase.database().ref('users').on('value', snapshot => {
    //   Vue.set(this.userTest, 'id', snapshot.key)
    // })

    // INITIAL CALL
    // this.globalUpdate()
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
  max-width: 400px;
  margin: auto;
}
.toolbarNone {
  padding-top: 0px !important;
}
.toolbarTasks {
  padding-top: 135px !important;
}
.simulation {
  z-index: 200;
}
</style>
