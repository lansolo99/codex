<template>
  <div class="taskList">
    <h6 v-if="filterTasks(periodicity.name).length > 0" class="subheader my-3 mt-4 black--text">
      <span>{{periodicity.name}}</span>
    </h6>

    <v-expansion-panel v-model="panel[ind]" @click.native="managePanels(ind)">
      <v-expansion-panel-content v-for="(task,key) in filterTasks(periodicity.name)" :key="key">
        <!-- Bar part -->
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
              <img :src="require(`@/assets/images/icons_categories/${task.category}.svg`)" alt>
            </div>
          </v-flex>

          <v-flex grow class="pt-1 pl-2 pr-3 pb-1 body-1">
            <span class="custom-title">{{task.title}}</span>
          </v-flex>

          <v-spacer></v-spacer>

          <v-flex shrink width="0"></v-flex>

          <!-- If subtasks -->
          <v-flex v-if="task.subtasks.length > 0" xs12 class="subtasks">
            <v-layout
              v-for="(subtask,key) in task.subtasks"
              :key="key"
              row
              wrap
              :class="`task ${task.status}`"
            >
              <v-flex shrink class="pt-1">
                <v-checkbox
                  @click.native.stop
                  class="ma-0 pa-0"
                  color="colorGreen"
                  hide-details
                  :input-value="subtask.checked"
                  @change="updateCheckedStatus(task.id, $event, 'subtask',subtask.id)"
                ></v-checkbox>
              </v-flex>
              <v-flex shrink class="pt-2 ml-2 icon-slot">
                <v-icon class="icon icon-arrow_return"></v-icon>
              </v-flex>
              <v-flex grow class="pa-1 pt-2 pl-3 pr-3 body-1">
                <span class="name">{{subtask.name}}</span>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <!-- Expanded part -->
        <v-card class="details blue-grey lighten-5 pa-2">
          <v-card-text>
            <h6>Description</h6>
            <p>{{task.description}}</p>
            <h6>Schedule</h6>
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

            <h6>Category</h6>
            <p>{{task.category}}</p>
            <v-btn large class="colorGreen white--text ma-0" @click="handleEdit(task.id)">Edit task</v-btn>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
// eslint-disable-next-line
import { isToday, getTime, getISODay, isThisWeek } from 'date-fns'
import { mapGetters, mapActions } from 'vuex'
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
    ...mapGetters({
      'userData': 'profile/getProfileData'
    }),
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
    ...mapActions({
      setCheckedStatus: 'tasks/setCheckedStatus',
      updateTask: 'tasks/updateTask',
      toggleTaskDialog: 'utility/toggleTaskDialog',
      setCurrentTask: 'utility/setCurrentTask'
    }),
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
      // Task completion update
      const checkTime = Date.now()
      let completionIndex = this.tasks[taskId].completion.indexOf(0)
      let completionValue
      // Everyday

      // is today : no completionIndex progression
      if (this.tasks[taskId].checked === true) {
        completionValue = 0
        if (isToday(this.tasks[taskId].checkTime)) {
          completionIndex = this.tasks[taskId].completion.indexOf(0) - 1
        }
      } else {
        completionValue = 1
      }

      // TasksProgress & store update
      EventBus.$emit('recordProgress')
      this.setCheckedStatus({ taskId, checkstatus, taskType, subtaskId, checkTime, completionIndex, completionValue })
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
    // Time
    console.log(getTime(new Date(2019, 0, 4, 11, 45, 5, 123)))

    // TASKS RECORD PROCESSING & MIDDLEWARE

    const copiedTasks = JSON.parse(JSON.stringify(this.tasks))

    // All task checks automations & guards
    for (let [key, value] of Object.entries(copiedTasks)) {
      // Weekly
      if (value.schedule.periodicity === 'Weekly') {
        // Everyday
        if (value.schedule.weekly === 'Everyday') {
          // Reset check
          if (!isToday(this.userData.connexionDateLast)) {
            // console.log('no it was another day')
            value.checked = false
          }
        }
      }

      const taskId = JSON.parse(JSON.stringify(key))
      const task = JSON.parse(JSON.stringify(value))
      this.updateTask({ taskId, task })
    }
  }
}
</script>

<style lang="scss">
.taskList {
  h6.subheader {
    opacity: 0.7;
  }

  .task {
    .custom-title {
      font-size: 16px;
    }

    .createTaskCard {
      height: 800px;
    }
  }
  .details {
    h6 {
      font-size: 15px !important;
      font-weight: 600;
      color: rgba(black, 0.6);
    }
    p {
      font-weight: 300;
      font-size: 14px;
    }
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
      position: relative;
      top: 1px;

      .material-icons {
        font-size: 31px;
      }

      .theme--light.v-icon {
        //color: rgba(0, 0, 0, 0.35);
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
  // Categories
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
  // Subtasks
  .subtasks {
    .flex {
      height: 38px;
    }

    .icon {
      &:before {
        font-size: 25px;
        position: relative;
        top: 1px;
        left: 4px;
      }
    }
    .name {
      font-weight: 300;
      font-size: 16px;
      display: block;
      margin-left: 2px;
    }
  }
}
</style>
