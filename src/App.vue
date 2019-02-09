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
import { format, getISODay, isToday, isSameDay, isThisWeek, isSameWeek, getISOWeek, getTime, addDays  } from 'date-fns'
import { EventBus } from '@/bus'
import TheNavbar from '@/components/TheNavbar'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      toolbarConf: 'toolbarTasks',
      isoDay: null,
      isoWeek: null,
      addedDays: 0
    }
  },
  components: {
    TheNavbar
  },
  computed: {
    ...mapState('tasks', {
      tasks: state => state
    }),
    ...mapState('time', {
      time: state => state
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
      updateProfile: 'profile/updateProfile',
      recordWeekScore: 'profile/recordWeekScore',
      updateTime: 'time/updateTime',
      updateTask: 'tasks/updateTask',
      rebootWeeklyTasksCompletions: 'tasks/rebootWeeklyTasksCompletions'
    }),
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
      const isoWeek = this.time.isoWeek
      this.recordWeekScore({ progressWeek, isoWeek })
    },
    globalUpdate (addedDays = 0) {
      // GLOBAL UPDATES
      console.log('last connexion date = ' + format(new Date(this.userData.connexionDateLast), 'DD/MM/YYYY'))

      const isThisWeekCustom = isSameWeek(
        addDays(new Date(this.userData.connexionDateLast), addedDays),
        new Date(this.userData.connexionDateLast),
        { weekStartsOn: 1 }
      )

      const isTodayCustom = isSameDay(
        addDays(new Date(this.userData.connexionDateLast), addedDays),
        new Date(this.userData.connexionDateLast)
      )

      // Week completions reset
      if (!isThisWeekCustom) {
        console.log('not the same week')
        this.rebootWeeklyTasksCompletions()
      }

      // Check reset & guards
      const copiedTasks = JSON.parse(JSON.stringify(this.tasks))
      // Loop
      for (let [key, value] of Object.entries(copiedTasks)) {
      // Weekly
        if (value.schedule.periodicity === 'Weekly') {
        // Reset checks if a new week has started
          if (!isThisWeekCustom) {
            value.checked = false
          }
          // Everyday
          if (value.schedule.weekly === 'Everyday') {
          // Reset check
            if (!isTodayCustom) {
              value.checked = false
            }
          }
          if (value.schedule.weekly === 'x1 time') {
          // Do nothing
          }
        // if(value.schedule.weekly === 'x1 time'){
        //   // Do nothing
        // }
        }
        const taskId = JSON.parse(JSON.stringify(key))
        const task = JSON.parse(JSON.stringify(value))
        this.updateTask({ taskId, task })
      }

      // Update connexionDateLast
      this.userData.connexionDateLast = addDays(new Date(Date.now()), this.addedDays)

      this.updateProfile(this.userData)
      console.log('updated last connexion date = ' + format(new Date(this.userData.connexionDateLast), 'DD/MM/YYYY') + 'updated')

      EventBus.$emit('recordProgress')
    },
    simulateNextDay () {
      console.log('NEXT DAY')
      this.addedDays += 1
      this.globalUpdate(1)
    }
  },
  mounted () {
  },
  created () {
    // console.log(getTime(new Date(2019, 0, 2, 11, 45, 5, 123)))
    // PROGRESS UPDATES
    EventBus.$on('recordProgress', () => {
      console.log('recordProgress')

      // Set date
      const isoDay = getISODay(addDays(new Date(Date.now()), this.addedDays))
      console.log('isoDay =' + isoDay)

      const isoWeek = getISOWeek(addDays(new Date(Date.now()), this.addedDays))
      console.log('isoweek =' + isoWeek)
      this.updateTime({ isoDay, isoWeek })

      // Do calculations
      this.calcWeeklyCompletion()
    })

    this.globalUpdate()
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
  padding-top: 132px !important;
}
.simulation {
  z-index: 200;
}
</style>
