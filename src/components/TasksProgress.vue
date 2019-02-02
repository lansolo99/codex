<template>
  <v-container class="taskProgress pt-0 pb-2">
    <v-layout>
      <v-flex xs6>
        <v-card
          flat
          height="100%"
          class="taskProgressContainer taskProgressContainer--bars transparent"
        >
          <span class="label white--text">TODAY (0/0 tasks)</span>

          <div class="progressbarContainer">
            <v-progress-linear v-model="progressToday" height="15" class="mt-2" width="80%"></v-progress-linear>
            <div class="progressbarContainer__value white--text text-xs-right">{{progressToday}}%</div>
          </div>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-card
          flat
          height="100%"
          class="taskProgressContainer taskProgressContainer--bars taskProgressContainer--week transparent"
        >
          <span class="label white--text">THIS WEEK</span>

          <div class="progressbarContainer">
            <v-progress-linear v-model="progressWeek" height="15" class="mt-2" width="80%"></v-progress-linear>
            <div class="progressbarContainer__value white--text text-xs-right">{{progressWeek}}%</div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { countObjectProperties } from '@/utils'
import { mapState } from 'vuex'
import { EventBus } from '@/bus'

export default {
  data () {
    return {
      progressToday: 0,
      progressWeek: 0,
      tooltipsZindexes: 0,
      tooltips: [false, false, false, false, false]
    }
  },
  computed: {
    ...mapState([
      'tasks'
    ]),
    tasksChecked: function () {
      return this.tasks
    }
  },
  watch: {
    tasksChecked: {
      handler: function (val, oldVal) {
        this.calcDailyCompletion()
        this.calcWeeklyCompletion()
      },
      deep: true
    }
  },
  methods: {

    calcDailyCompletion () {
      const countTasks = countObjectProperties(this.tasks)
      const taskValue = 100 / countTasks
      let total = 0
      let totalSubtasks = 0

      const countCheckedTasks = Object.entries(this.tasks)
        .filter(v => { return v[1].checked === true })
        .length

      Object.entries(this.tasks)
        .filter(v => { return v[1].checked === false && v[1].subtasks.length > 0 })
        .forEach(v => {
          const subtaskLength = v[1].subtasks.length
          const subtaskValue = taskValue / subtaskLength

          const countSubtasksChecked = Object.entries(v[1].subtasks)
            .filter(sub => { return sub[1].checked === true })
            .length
          totalSubtasks += subtaskValue * countSubtasksChecked
        })

      total = Math.trunc((taskValue * countCheckedTasks) + totalSubtasks)
      if (isNaN(total)) { total = 0 }
      this.progressToday = total
    },
    calcWeeklyCompletion () {
      const total = Math.trunc(this.progressToday / 7)
      this.progressWeek = total
    }
  },
  mounted () {
    this.calcDailyCompletion()
    this.calcWeeklyCompletion()
  },
  created () {
    EventBus.$on('nextTooltip', (tooltips) => {
      this.tooltips = tooltips
    })
    EventBus.$on('disableTooltips', (zindex) => {
      this.tooltipsZindexes = zindex
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
