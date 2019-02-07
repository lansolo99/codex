<template>
  <v-container class="taskProgress pt-0 pb-2">
    <v-layout>
      <v-flex xs6>
        <v-card
          flat
          height="100%"
          class="taskProgressContainer taskProgressContainer--bars transparent"
        >
          <span
            class="label white--text"
          >TODAY ({{this.userData.stats.dailyTasksChecked}}/{{this.userData.stats.dailyTasks.length}} tasks)</span>

          <div class="progressbarContainer">
            <v-progress-linear
              v-model="this.userData.stats.progressToday"
              height="15"
              class="mt-2"
              width="80%"
            ></v-progress-linear>
            <div
              class="progressbarContainer__value white--text text-xs-right"
            >{{this.userData.stats.progressToday}}%</div>
          </div>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-card
          flat
          height="100%"
          class="taskProgressContainer taskProgressContainer--bars taskProgressContainer--week transparent"
        >
          <span class="label white--text">THIS WEEK (day {{time.isoDay}}/7)</span>
          <div class="progressbarContainer">
            <v-progress-linear
              v-model="this.userData.stats.progressWeek"
              height="15"
              class="mt-2"
              width="80%"
            ></v-progress-linear>
            <div
              class="progressbarContainer__value white--text text-xs-right"
            >{{this.userData.stats.progressWeek}}%</div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// eslint-disable-next-line
import { countObjectProperties, getIsoDayFromString, getStringFromIsoDay } from '@/utils'
// eslint-disable-next-line
import { getISODay, isThisWeek, getISOWeek } from 'date-fns'
import { mapState, mapGetters, mapActions } from 'vuex'
import { EventBus } from '@/bus'

export default {
  data () {
    return {
      dailyTasks: null,
      dailyTasksChecked: null,
      progressToday: null,
      progressWeek: null
    }
  },
  computed: {
    ...mapState('tasks', {
      tasks: state => state
    }),
    ...mapState('time', {
      time: state => state
    }),
    ...mapGetters({
      userData: 'profile/getProfileData'
    }),
    tasksChecked: function () {
      return this.tasks
    }
  },
  watch: {
    tasksChecked: {
      handler: function (val, oldVal) {
        // EventBus.$emit('recordProgress')
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      recordProgress: 'profile/recordProgress',
      recordWeekScore: 'profile/recordWeekScore',
      updateTime: 'time/updateTime',
      updateProfile: 'profile/updateProfile'
    }),
    calcDailyCompletion () {
      // todayProgress value is based on everydays + all specific days + singles

      // Filter daily tasks from tasks
      const dailyTasks = Object.values(this.tasks)
        .filter(task => {
          return (task.schedule.periodicity === 'Weekly' &&
        task.schedule.weekly === 'Everyday') ||
        (task.schedule.periodicity === 'On specific days' &&
        task.schedule.specificDays.find(v => { return v === getStringFromIsoDay(this.time.isoDay) })) ||
        (task.schedule.periodicity === 'Once' &&
        task.schedule.once === 'single')
        })

      // UI feed
      this.userData.stats.dailyTasks = dailyTasks

      // Distribute tasks value

      const taskValue = 100 / dailyTasks.length
      let total = 0
      let totalSubtasks = 0

      // Count checked
      const countCheckedTasks = Object.entries(dailyTasks)
        .filter(v => { return v[1].checked === true })
        .length

      // UI feed
      this.userData.stats.dailyTasksChecked = countCheckedTasks

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
      this.progressToday = total
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
      this.progressWeek = total
    }

  },
  created () {
    // PROGRESS UPDATES
    EventBus.$on('recordProgress', () => {
      console.log('recordprogress')

      // Set date
      const isoDay = getISODay(Date.now())
      const isoWeek = getISOWeek(Date.now())
      this.updateTime({ isoDay, isoWeek })

      // Do calculations
      this.calcDailyCompletion()
      this.calcWeeklyCompletion()

      // Update store
      const progressToday = this.userData.stats.progressToday
      const progressWeek = this.userData.stats.progressWeek

      this.recordProgress({ progressToday, isoDay })
      this.recordWeekScore({ progressWeek, isoWeek })
    })
  }
}
</script>

<style lang="scss">
.taskProgress {
  .taskProgressContainer {
    text-align: left;
    border-radius: 0 !important;

    .label {
      opacity: 0.7;
      font-size: 12px;
    }
    &--bars {
      padding-right: 60px !important;
    }

    &--week {
      position: relative;
      left: 5px;
    }

    .progressbarContainer {
      position: relative;
      top: -4px;
      &__value {
        position: absolute;
        top: -5px;
        right: -45px;
      }
    }
    .v-progress-linear__bar__determinate {
      @include progress-linear-fill;
    }
    .v-progress-linear__background {
      @include progress-linear-background;
    }
  }

  .v-tooltip__content {
    background-color: white;
    font-size: 16px;
    opacity: 1 !important;
    padding: 0px;
    &-title {
      font-size: 17px;
      font-weight: bold;
      display: block;
      padding: 5px 10px;
    }
    &-plain {
      display: block;
      padding: 10px;
      font-size: 15px;
      color: #333333;
    }
  }
}
</style>
