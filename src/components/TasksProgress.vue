<template>
  <v-container class="taskProgress pt-0 pb-2">
    <v-layout>
      <v-flex xs12>
        <v-card
          flat
          height="100%"
          class="taskProgressContainer taskProgressContainer--bars taskProgressContainer--week transparent"
        >
          <span class="label white--text">THIS WEEK GLOBAL SCORE (day {{time.isoDay}}/7)</span>
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
  methods: {
    ...mapActions({
      updateTime: 'time/updateTime',
      recordWeekScore: 'profile/recordWeekScore',
      updateProfile: 'profile/updateProfile'
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
      this.calcWeeklyCompletion()
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
