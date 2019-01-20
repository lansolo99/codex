<template>
  <v-container class="pa-0">
    <v-layout>
      <v-flex xs4 text-xs-center>
        <v-card flat height="100%" class="taskProgressContainer green darken-3 pa-3 pt-4">
          <v-avatar>
            <v-icon size="50px" dark>account_circle</v-icon>
          </v-avatar>
          <div class="white--text mt-1">LEVEL 0/100</div>
        </v-card>
      </v-flex>
      <v-flex xs8>
        <v-card
          flat
          height="100%"
          class="taskProgressContainer taskProgressContainer--bars green darken-2 pa-3"
        >
          <span class="white--text">TODAY</span>
          <div class="progressbarContainer">
            <v-progress-linear v-model="progressToday" color="white" class="mt-2" width="80%"></v-progress-linear>
            <div class="progressbarContainer__value white--text text-xs-right">{{progressToday}}%</div>
          </div>
          <span class="white--text">THIS WEEK</span>
          <div class="progressbarContainer">
            <v-progress-linear v-model="progressWeek" color="white" class="mt-2 mb-2"></v-progress-linear>
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

export default {
  data () {
    return {
      progressToday: null,
      progressWeek: null
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
  }
}
</script>

<style lang="scss">
.taskProgressContainer {
  border-radius: 0 !important;
  &--bars {
    padding-right: 70px !important;
  }

  .progressbarContainer {
    position: relative;
    &__value {
      position: absolute;
      top: -7px;
      right: -45px;
    }
  }
}
</style>
