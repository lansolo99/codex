<template>
  <v-expansion-panel>
    <v-expansion-panel-content v-for="(task,key) in filterTasks(periodicity.name)" :key="key">
      <v-layout slot="header" row wrap :class="`task ${task.status} mr-2`">
        <v-flex shrink class="pt-1">
          <v-checkbox
            @click.native.stop
            class="ma-0 pa-0"
            hide-details
            color="success"
            :disabled="hasTaskSubtasks(task)"
            :input-value="task.checked"
            @change="updateCheckedStatus(task.id, $event, 'task')"
          ></v-checkbox>
        </v-flex>
        <v-flex shrink>
          <div :class="`cat pa-1 pt-1 pl-2 pr-2 ${task.category}`">
            <span class="body-2">{{task.category.substr(0,1)}}</span>
          </div>
        </v-flex>
        <v-flex grow class="pa-1 pt-1 pl-3 pr-3 body-1">{{task.title}}</v-flex>

        <v-flex v-if="task.subtasks.length > 0" xs12>
          <v-divider class="my-3"></v-divider>
          <v-layout
            v-for="(subtask,key) in task.subtasks"
            :key="key"
            row
            wrap
            :class="`task ${task.status} mt-3`"
          >
            <v-flex shrink class="pt-1">
              <v-checkbox
                @click.native.stop
                class="ma-0 pa-0"
                color="success"
                hide-details
                :input-value="subtask.checked"
                @change="updateCheckedStatus(task.id, $event, 'subtask',subtask.id)"
              ></v-checkbox>
            </v-flex>
            <v-flex grow class="pa-1 pt-1 pl-0 pr-3 body-1">{{subtask.name}}</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-card class="grey lighten-4">
        <v-card-text>
          <h2 class="body-2">Description</h2>
          <p>{{task.description}}</p>
          <h2 class="body-2">Schedule</h2>
          <p>
            {{task.schedule.periodicity}} :
            <span
              v-if="task.schedule.periodicity === 'Weekly'"
            >{{task.schedule.weekly}}</span>
            <span
              v-if="task.schedule.periodicity === 'On specific days'"
            >{{getTaskDays(task.schedule.specificDays)}}</span>
            <span v-if="task.schedule.periodicity === 'Once'">{{task.schedule.once}}</span>
          </p>

          <h2 class="body-2">Category</h2>
          <p>{{task.category}}</p>
          <v-btn outline large small class="mt-0 ml-0" @click="handleEdit(task.id)">Edit task</v-btn>
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
      readonly: false
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
      },
      deep: true
    }
  },

  methods: {
    ...mapActions([
      'setCheckedStatus', 'toggleTaskDialog', 'setCurrentTask'
    ]),
    filterTasks (periodicityStr) {
      return Object.values(this.tasks)
        .filter(task => {
          if (periodicityStr === 'Weeklies') {
            return task.schedule.periodicity === 'Weekly' || task.schedule.periodicity === 'On specific days'
          } else if (periodicityStr === 'Monthlies') {
            return task.schedule.periodicity === 'Once' && task.schedule.once === 'monthly'
          } else if (periodicityStr === 'Yearlies') {
            return task.schedule.periodicity === 'Once' && task.schedule.once === 'yearly'
          } else if (periodicityStr === 'Singles') {
            return task.schedule.periodicity === 'Once' && task.schedule.once === 'single'
          }
        })
    },
    getTaskDays (days) {
      let daysList = []
      for (let [key, value] of Object.entries(days)) {
        console.log(key)
        console.log(value)
        daysList.push(value)
      }
      var daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      function daysOfWeekSorter (x, y) {
        return daysOfWeek.indexOf(x) - daysOfWeek.indexOf(y)
      }
      return daysList.sort(daysOfWeekSorter).join(', ')
    },
    updateCheckedStatus (taskId, checkstatus, taskType, subtaskId) {
      this.setCheckedStatus({ taskId, checkstatus, taskType, subtaskId })
    },
    hasTaskSubtasks (task) {
      return task.subtasks.length > 0
    },
    handleEdit (taskId) {
      console.log(taskId)
      this.setCurrentTask(taskId)
      this.toggleTaskDialog(true)
    }
  }
}
</script>

<style lang="scss">
.cat {
  background-color: green;
  width: 30px;
  height: 100%;
  color: white;
  text-align: center;
}

.task {
  .Fitness {
    background-color: #f44336;
  }
  .Nutrition {
    background-color: #cddc39;
  }
  .Skills {
    background-color: #607d8b;
  }
  .Finance {
    background-color: #ffc107;
  }
  .Education {
    background-color: #00bcd4;
  }
  .Lifestyle {
    background-color: #3f51b5;
  }
}
</style>
