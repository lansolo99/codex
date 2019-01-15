<template>
  <v-expansion-panel>
    <v-expansion-panel-content v-for="(task,key) in filterTasks(periodicity.name)" :key="key">
      <v-layout slot="header" row wrap :class="`task ${task.status} mr-2`">
        <v-flex xs1 class="green">
          <v-checkbox
            @click.native.stop
            class="ma-0 pa-0"
            color="white"
            hide-details
            :disabled="hasTaskSubtasks(task)"
            :input-value="task.checked"
            @change="updateCheckedStatus(task.id, $event, 'task')"
          ></v-checkbox>
        </v-flex>
        <v-flex xs1 class="red">CAT</v-flex>
        <v-flex xs10 class="purple">{{task.title}}</v-flex>

        <v-flex v-if="task.subtasks.length > 0" xs12>
          <v-divider class="my-3"></v-divider>
          <v-layout
            v-for="(subtask,key) in task.subtasks"
            :key="key"
            row
            wrap
            :class="`task ${task.status} mt-3`"
          >
            <v-flex xs1 class="green">
              <v-checkbox
                @click.native.stop
                class="ma-0 pa-0"
                color="white"
                hide-details
                :input-value="subtask.checked"
                @change="updateCheckedStatus(task.id, $event, 'subtask',subtask.id)"
              ></v-checkbox>
            </v-flex>
            <v-flex xs11 class="purple">{{subtask.name}}</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-card>
        <v-card-text>
          <ul>
            <li>{{task.description}}</li>
            <li>{{task.schedule.periodicity}}</li>
            <li>{{task.category}}</li>
          </ul>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      testDisabled: true
    }
  },
  props: {
    tasks: {
      required: true,
      type: Object
    },
    periodicity: {
      required: true,
      type: Object
    }
  },
  computed: {
    tasksChecked: function () {
      return this.tasks
    }
  },
  watch: {
    tasksChecked: {
      handler: function (val, oldVal) {
        // console.log(Object.values(this.tasks.subtasks))

        // this.tasks.find(v => { return v === v })
      },
      deep: true
    }
  },

  methods: {
    ...mapActions([
      'setCheckedStatus'
    ]),
    filterTasks (periodicityStr) {
      return Object.values(this.tasks)
        .filter(task => {
          if (periodicityStr === 'Weeklies') {
            return task.schedule.periodicity === 'Weekly'
          } else if (periodicityStr === 'Monthlies') {
            return task.schedule.periodicity === 'Once' && task.schedule.once === 'monthly'
          } else if (periodicityStr === 'Yearlies') {
            return task.schedule.periodicity === 'Once' && task.schedule.once === 'yearly'
          } else if (periodicityStr === 'Singles') {
            return task.schedule.periodicity === 'Once' && task.schedule.once === 'single'
          }
        })
    },
    updateCheckedStatus (taskId, checkstatus, taskType, subtaskId) {
      // if subtask :
      // get subtasks list
      // console.log(typeof this.$store.state.tasks[taskId].subtasks)
      // check if all

      // Anyway
      this.setCheckedStatus({ taskId, checkstatus, taskType, subtaskId })
    },
    hasTaskSubtasks (task) {
      return task.subtasks.length > 0
    }
  }
}
</script>

<style>
</style>
