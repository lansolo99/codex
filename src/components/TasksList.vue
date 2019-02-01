<template>
  <div class="taskList">
    <h6 v-if="filterTasks(periodicity.name).length > 0" class="my-3 black--text">
      <span>{{periodicity.name}}</span>
    </h6>

    <v-expansion-panel v-model="panel[ind]" @click.native="managePanels(ind)">
      <v-expansion-panel-content v-for="(task,key) in filterTasks(periodicity.name)" :key="key">
        <v-layout slot="header" row wrap :class="`task ${task.status} mr-2 px-0`">
          <v-flex shrink>
            <v-checkbox
              @click.native.stop
              class="ma-0 pa-0"
              hide-details
              color="colorGreen"
              :disabled="hasTaskSubtasks(task)"
              :input-value="task.checked"
              @change="updateCheckedStatus(task.id, $event, 'task')"
            ></v-checkbox>
            <v-checkbox class="preventExpansion" @click.native.stop v-if="task.subtasks.length > 0"></v-checkbox>
          </v-flex>
          <v-flex shrink class="ml-2">
            <div :class="`category ${task.category}`">
              <img src="@/assets/images/icons_categories/Lifestyle.svg">
              <!-- <img :src="`@/assets/images/icons_categories/${task.category}.svg`"> -->
            </div>
          </v-flex>

          <v-flex grow class="pt-1 pl-2 pr-3 pb-1 body-1">
            <span class="custom-title">{{task.title}}</span>
          </v-flex>

          <v-spacer></v-spacer>

          <v-flex shrink width="0"></v-flex>

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
        <v-card class="green lighten-5">
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
            <v-btn outline block class="mt-0 ml-0" @click="handleEdit(task.id)">Edit task</v-btn>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { EventBus } from '@/bus'

export default {

  data () {
    return {
      readonly: false,
      panel: [null, null, null, null],
      tooltipsZindexes: 0,
      tooltips: [false, false, false, false, false]
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
    },
    ind: {
      required: true,
      type: Number
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
      'setCheckedStatus', 'toggleTaskDialog', 'closeTaskPanels', 'setCurrentTask'
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
      for (let value of Object.values(days)) {
        daysList.push(value)
      }

      var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
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
      this.setCurrentTask(taskId)
      this.toggleTaskDialog(true)
    },
    managePanels (ind) {
      const managePanel = this.panel.map((v, i) => {
        if (i === ind) {
          return v
        } else {
          return null
        }
      })
      EventBus.$emit('closeOtherPanels', managePanel)
    }
  },
  created () {
    EventBus.$on('closeOtherPanels', panel => {
      this.panel = panel
    })
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
.taskList {
  h6 {
    opacity: 0.7;
  }
  //Expansions
  .v-expansion-panel__header {
    padding: 12px 12px;
    align-items: flex-start !important;
    &__icon {
      position: relative;
      top: 5px;
    }
    //Checkboxes
    .v-input--selection-controls {
      .material-icons {
        font-size: 31px;
      }
    }
    // Invisible checkboxes (prevent openning panel at click when disabled state)
    .preventExpansion {
      position: absolute;
      top: -3px;
      left: 24px;
      opacity: 0;
    }
  }

  .category {
    width: 34px;
    height: 100%;
    color: white;
    text-align: center;

    img {
      display: block;
      width: 34px;
      position: relative;
      top: -1px;
    }
  }

  .task {
    .custom-title {
      font-size: 16px;
    }

    .createTaskCard {
      height: 800px;
    }
  }
}
</style>
