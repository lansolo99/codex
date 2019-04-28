<template>
  <div class="taskList">
    <v-expansion-panel
      v-model="panel"
      class="mt-2"
      v-if="utility.tasksReady"
      v-click-outside="closeTasksPanels"
    >
      <v-expansion-panel-content
        v-for="(task,key) in filterTasks(periodicity.name)"
        :key="key"
      >
        <v-layout
          slot="header"
          row
          class="task mr-2 px-0"
          :class="[{disabled: task.disabled}, task.status]"
        >
          <v-flex
            shrink
            class="checkboxFlexContainer"
          >
            <v-checkbox
              @click.native.stop
              hide-details
              class="ma-0 pa-0 pt-1"
              :class="{hasSubtask : hasTaskSubtasks(task)}"
              color="black"
              off-icon
              on-icon="icon-checkbox_on"
              :disabled="hasTaskSubtasks(task) || task.disabled === true"
              :input-value="task.checked"
              @change="updateCheckedStatus(task.id, $event, 'task', key)"
            ></v-checkbox>
            <v-checkbox
              class="preventExpansion"
              @click.native.stop
              v-if="hasTaskSubtasks(task) || task.disabled"
            ></v-checkbox>
            <v-icon class="icon icon-checkbox_off"></v-icon>
            <v-icon
              :class="{active: task.checked}"
              class="icon icon-checkbox_filled"
            ></v-icon>
          </v-flex>
          <v-flex
            shrink
            class="ml-2"
          >
            <div :class="`category ${task.category}`">
              <img
                :src="require(`@/assets/images/icons_categories/${task.category}.svg`)"
                alt
              >
            </div>
          </v-flex>
          <v-flex class="pt-1 pl-2 pr-3 pb-1 body-1">
            <span :class="['custom-title', { completed: task.checked } ]">{{task.title}}</span>
          </v-flex>
          <v-spacer></v-spacer>

          <v-flex
            shrink
            width="0"
          ></v-flex>
          <!-- If subtasks -->
          <v-flex
            v-if="task.subtasks"
            xs12
            class="subtasks"
          >
            <v-layout
              v-for="(subtask,key) in task.subtasks"
              :key="key"
              row
              wrap
              :class="`task ${task.status}`"
            >
              <v-flex
                shrink
                class="pt-2 icon-slot"
              >
                <v-icon class="icon icon-arrow_return pl-1"></v-icon>
              </v-flex>
              <v-flex
                shrink
                class="pt-1 checkboxFlexContainer"
              >
                <v-checkbox
                  @click.native.stop
                  class="ma-0 pa-0"
                  color="black"
                  off-icon
                  on-icon="icon-checkbox_on"
                  hide-details
                  :disabled="task.disabled === true"
                  :input-value="subtask.checked"
                  @change="updateCheckedStatus(task.id, $event, 'subtask',key,subtask.id)"
                ></v-checkbox>
                <v-checkbox
                  class="preventExpansion"
                  @click.native.stop
                  v-if="task.disabled === true"
                ></v-checkbox>
                <v-icon class="icon icon-checkbox_off"></v-icon>
                <v-icon
                  :class="{active: subtask.checked}"
                  class="icon icon-checkbox_filled"
                ></v-icon>
              </v-flex>
              <v-flex
                grow
                class="pa-1 pt-2 pl-2 pr-3 body-1"
              >
                <span :class="['name', { completed: subtask.checked } ]">{{subtask.name}}</span>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <!-- Expanded part -->
        <v-card class="details blue-grey lighten-5 pa-2">
          <v-card-text>
            <h6>Schedule</h6>
            <p>
              <span v-if="task.schedule.periodicity === 'Weekly'">
                <span v-if="task.schedule.weekly === 'Everyday'">{{task.schedule.weekly}}</span>
                <span v-else>{{task.schedule.weekly}} a week</span>
              </span>
              <span v-if="task.schedule.periodicity === 'On specific days'">{{getTaskDays(task.schedule.specificDays)}}</span>
              <span v-if="task.schedule.periodicity === 'Once'">{{task.schedule.once}}</span>
            </p>

            <h6>Category</h6>
            <p>{{task.category}}</p>
            <v-btn
              large
              class="colorGreen white--text ma-0"
              @click="handleEdit(task.id)"
            >Edit task</v-btn>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
// eslint-disable-next-line
import { isToday } from 'date-fns'
import { mapState, mapGetters, mapActions } from 'vuex'
import { EventBus } from '@/bus'
import { clickOutsideDirective } from '@/utils/directives'

export default {

  data () {
    return {
      readonly: false,
      panel: []
    }
  },
  directives: {
    'click-outside': clickOutsideDirective
  },
  props: {
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
    ...mapState({
      tasks: state => state.tasks,
      utility: state => state.utility,
      time: state => state.time
    }),
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
      updateTasksCompletionsHistory: 'tasks/updateTasksCompletionsHistory',
      toggleTaskDialog: 'utility/toggleTaskDialog',
      setCurrentTask: 'utility/setCurrentTask'

    }),
    filterTasks (periodicityStr) {
      const sortedTasks = []
      const weeklyTasks = Object.values(this.tasks)
        .filter(task => {
          if (periodicityStr === 'Weeklies') {
            return task.schedule.periodicity === 'Weekly' ||
            task.schedule.periodicity === 'On specific days' ||
            (task.schedule.periodicity === 'Once' && task.schedule.once === 'single')
          }
        })
      // console.log('weeklyTasks.length = ' + weeklyTasks.length)
      // console.log(Object.values(this.tasks).length)

      // Everydays
      weeklyTasks.forEach(task => {
        if (task.schedule.periodicity === 'Weekly' && task.schedule.weekly === 'Everyday') {
          sortedTasks.push(task)
        }
      })
      // x (n) time(s)
      weeklyTasks.forEach(task => {
        if (task.schedule.periodicity === 'Weekly' && task.schedule.weekly !== 'Everyday') {
          sortedTasks.push(task)
        }
      })
      // Singles
      weeklyTasks.forEach(task => {
        if (task.schedule.periodicity === 'Once' && task.schedule.once === 'single') {
          sortedTasks.push(task)
        }
      })

      // Specific days (not today)
      weeklyTasks.forEach(task => {
        if (task.schedule.periodicity === 'On specific days' && task.disabled === true) {
          sortedTasks.push(task)
        }
      })

      // Specific days (not today)
      weeklyTasks.forEach(task => {
        if (task.schedule.periodicity === 'On specific days' && task.disabled === false) {
          sortedTasks.unshift(task)
        }
      })

      return sortedTasks
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
    updateCheckedStatus (taskId, checkstatus, taskType, key, subtaskId) {
      // Task completion update
      console.log('updateCheckedStatus')
      console.log('key = ' + key)

      let completionIndex
      let completionValue
      let singleSlotOrFullTasks

      // Is task single slot or full task ?
      if (this.tasks[taskId].completion) {
        if (this.tasks[taskId].completion.length === 1 || (this.tasks[taskId].completion.length > 1 && !this.tasks[taskId].completion.includes(0))) {
          singleSlotOrFullTasks = true
        } else {
          singleSlotOrFullTasks = false
        }
      }

      // CASE 1 : NOT CHECKED
      // Set completion Index regarding the slots number or already checked slots
      if (singleSlotOrFullTasks) {
        completionIndex = this.tasks[taskId].completion.length - 1
      } else {
        completionIndex = this.tasks[taskId].completion.indexOf(0)
      }

      // CASE 2 : CHECKED
      if (this.tasks[taskId].checked === true) {
        // If is today : no completionIndex progression
        if (isToday(this.tasks[taskId].checkTime)) {
          if (!singleSlotOrFullTasks) {
            completionIndex = this.tasks[taskId].completion.indexOf(0) - 1
          }
        }
        completionValue = 0
      } else {
        completionValue = 1
      }

      // Update checks
      const checkTime = Date.now()
      console.log('taskId = ' + taskId)

      this.setCheckedStatus({ taskId, checkstatus, taskType, subtaskId, checkTime, completionIndex, completionValue })
      // Update stats
      EventBus.$emit('recordProgress')
      // Record in completions history
      const currentUserWeek = this.time.currentUserWeek
      console.log('currentUserWeek = ' + currentUserWeek)
      const isoDay = this.time.isoDay
      this.updateTasksCompletionsHistory({ currentUserWeek, isoDay })
    },
    hasTaskSubtasks (task) {
      return task.subtasks.length > 0
    },
    handleEdit (taskId) {
      this.setCurrentTask(taskId)
      this.toggleTaskDialog(true)
    },
    closeTasksPanels () {
      EventBus.$emit('closeTasksListPanels')
    }
  },
  mounted () {
    EventBus.$on('updateCheckedStatus', ({ defineTaskId, defineStatus, defineTaskType }) => {
      this.updateCheckedStatus(defineTaskId, defineStatus, defineTaskType)
    })
    EventBus.$on('closeTasksListPanels', () => {
      this.panel = null
    })
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
      position: relative;
      transition: all 0.3s ease-out;
      @include strikethrough;
      display: block;
      margin-right: 60px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
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
    .task {
      &.disabled {
        opacity: 0.4;
      }
    }
    &__icon {
      position: relative;
      top: 5px;
    }
    //Checkboxes
    .v-input--selection-controls {
      position: relative;
      top: 1px;
      left: -5px;
      z-index: 2;
      .v-input--selection-controls__ripple {
        left: -5px !important;
      }
      .v-icon {
        font-size: 35px;
      }
    }
    // Invisible checkboxes (prevent openning panel at click when disabled state)
    .checkboxFlexContainer {
      position: relative;
      .icon-checkbox_off,
      .icon-checkbox_filled {
        position: absolute;
        font-size: 35px;
        top: 0px;
        left: -5px;
        z-index: 0;
        color: $color-golden;
      }
      .icon-checkbox_off {
        color: $color-golden;
      }
      .icon-checkbox_filled {
        display: none;
        &.active {
          display: inherit;
        }
      }
      .hasSubtask + .icon-checkbox_off {
        opacity: 0.5;
      }
    }
    .preventExpansion {
      position: absolute;
      background-color: green;
      top: -19px;
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
      &.checkboxFlexContainer {
        margin-left: 13px;
        margin-top: 2px;
      }
    }

    .icon {
      &:before {
      }
    }
    .name {
      font-weight: 300;
      font-size: 16px;
      margin-left: 2px;
      position: relative;
      transition: all 0.3s ease-out;
      @include strikethrough;
    }
  }
}
</style>
