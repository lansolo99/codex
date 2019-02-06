<template>
  <v-dialog
    id="taskDialog"
    content-class="taskEditor"
    transition="slide-y-transition"
    scrollable
    fullscreen
    v-model="dialogTask"
  >
    <v-card flat tile>
      <!-- Toolbar -->
      <v-toolbar dark class="secondary dialogToolbar">
        <v-btn depressed flat @click="handleCancel">cancel</v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title
          class="primary--text font-weight-bold"
        >{{currentTask=== "new" ? 'New Task' : 'Edit Task'}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn depressed flat @click="handleSave">{{currentTask=== "new" ? 'Save' : 'Update'}}</v-btn>
      </v-toolbar>
      <!-- Form -->
      <v-card-text class="pa-0">
        <v-container class="dialogContainer pa-0">
          <v-form ref="taskForm" lazy-validation>
            <div class="secondary pa-4">
              <h6 class="white--text mb-3">Informations</h6>
              <v-text-field
                dark
                label="Title"
                v-model="task.title"
                required
                :error-messages="titleErrors"
                @input="$v.task.title.$touch()"
                @blur="$v.task.title.$touch()"
              ></v-text-field>
              <v-textarea dark label="Description" v-model="task.description"></v-textarea>
              <v-select
                dark
                :items="categories"
                label="Category"
                v-model="task.category"
                required
                :error-messages="categoryErrors"
                @input="$v.task.category.$touch()"
                @blur="$v.task.category.$touch()"
              ></v-select>
            </div>
            <div class="primary pa-4">
              <h6 class="my-3">Schedule</h6>
              <v-tabs
                v-model="schedule.active"
                color="secondary"
                dark
                slider-color="colorGreen"
                grow
              >
                <v-tab v-for="option in schedule.options" :key="option" ripples>{{ option }}</v-tab>
                <v-tab-item :value="0">
                  <v-select
                    class="mt-3"
                    color="secondary"
                    :items="schedule.weekly"
                    label="Choose a frequence"
                    v-model="task.schedule.weekly"
                    :error-messages="scheduleWeeklyErrors"
                  ></v-select>
                </v-tab-item>
                <v-tab-item :value="1">
                  <v-layout>
                    <v-flex align-self-center class="pt-4">
                      <v-input :error-messages="scheduleSpecificDaysErrors" max="100px">
                        <v-btn-toggle v-model="task.schedule.specificDays" multiple>
                          <v-btn class="px-3" flat value="Monday">M</v-btn>
                          <v-btn class="px-3" flat value="Tuesday">T</v-btn>
                          <v-btn class="px-3" flat value="Wednesday">W</v-btn>
                          <v-btn class="px-3" flat value="Thursday">T</v-btn>
                          <v-btn class="px-3" flat value="Friday">F</v-btn>
                          <v-btn class="px-3" flat value="Saturday">S</v-btn>
                          <v-btn class="px-3" flat value="Sunday">S</v-btn>
                        </v-btn-toggle>
                      </v-input>
                    </v-flex>
                  </v-layout>
                </v-tab-item>
                <v-tab-item :value="2">
                  <v-radio-group
                    v-model="task.schedule.once"
                    :error-messages="scheduleOnceErrors"
                    column
                  >
                    <v-radio color="black" label="Single task" value="single"></v-radio>
                    <v-radio color="black" label="Monthly goal" value="monthly"></v-radio>
                    <v-radio color="black" label="Yearly goal" value="yearly"></v-radio>
                  </v-radio-group>
                </v-tab-item>
              </v-tabs>
              <h6 class="my-3">Subtasks</h6>

              <v-card>
                <!-- Subtasks added -->
                <div class="grey lighten-2 pa-2 pl-3" v-if="task.subtasks.length > 0">
                  <v-layout v-for="(subtask,key) in $v.task.subtasks.$each.$iter" :key="subtask.id">
                    <v-text-field
                      placeholder="Your new subtask"
                      :error-messages="subtaskErrors(subtask)"
                      v-model="subtask.name.$model"
                    ></v-text-field>
                    <v-btn fab dark small class="colorRed mt-3" @click="removeSubTask(key)">
                      <v-icon class="icon icon-delete"></v-icon>
                    </v-btn>
                  </v-layout>
                </div>
                <div class="white pa-2 pl-3">
                  <v-layout>
                    <v-text-field placeholder="Add a new subtask" v-model="newSubtask.name"></v-text-field>
                    <v-btn fab dark small class="colorGreen mt-3" @click="addNewSubTask">
                      <v-icon class="icon icon-add"></v-icon>
                    </v-btn>
                  </v-layout>
                </div>
              </v-card>
              <!-- Delete task -->
              <v-layout class="mt-4 align-center justify-center">
                <v-btn
                  large
                  center
                  v-if="currentTask !== 'new'"
                  color="colorRed white--text px-5"
                  @click="handleDelete(task.id)"
                >Delete task</v-btn>
              </v-layout>
            </div>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, requiredIf } from 'vuelidate/lib/validators'
import { EventBus } from '@/bus'
import * as easings from 'vuetify/es5/util/easing-patterns'

export default {

  data () {
    return {
      easings: Object.keys(easings),
      dialogTask: false,
      categories: [
        'Fitness',
        'Nutrition',
        'Skills',
        'Finance',
        'Education',
        'Lifestyle'
      ],
      schedule: {
        active: 1,
        tabs: [
          { id: 0, name: 'Weekly' },
          { id: 1, name: 'On specific days' },
          { id: 2, name: 'Once' }
        ],
        options: [
          'Weekly',
          'On specific days',
          'Once'
        ],
        weekly: [
          'Everyday',
          'x1 time',
          'x2 times',
          'x3 times',
          'x4 times',
          'x5 times',
          'x6 times'
        ],
        specificDays: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ]

      },
      newSubtask: {
        name: ''
      },
      task: {
        id: null,
        startDate: null,
        title: null,
        description: null,
        category: null,
        schedule: {
          periodicity: null,
          weekly: null,
          specificDays: [],
          once: null
        },
        subtasks: [],
        status: 'ongoing',
        checked: false,
        checkTime: null,
        completion: []
      },
      currentTask: 'new'

    }
  },
  mixins: [validationMixin],
  validations: {
    task: {
      title: { required },
      category: { required },
      schedule: {
        weekly: {
          required: requiredIf(function () {
            return this.task.schedule.periodicity === 'Weekly'
          })
        },
        specificDays: {
          required: requiredIf(function () {
            return this.task.schedule.periodicity === 'On specific days'
          })
        },
        once: {
          required: requiredIf(function () {
            return this.task.schedule.periodicity === 'Once'
          })
        }
      },
      subtasks: {
        $each: {
          name: { required }
        }
      }
    }
  },
  computed: {
    ...mapState({
      storeDialogTask: state => state.utility.dialogTask,
      storeCurrentTask: state => state.utility.currentTask.id
    }
    ),
    titleErrors () {
      const errors = []
      if (!this.$v.task.title.$dirty) return errors
      !this.$v.task.title.required && errors.push('Give a name to your task!')
      return errors
    },
    categoryErrors () {
      const errors = []
      if (!this.$v.task.category.$dirty) return errors
      !this.$v.task.category.required && errors.push('Please select a category!')
      return errors
    },
    scheduleWeeklyErrors () {
      const errors = []
      if (!this.$v.task.schedule.weekly.$dirty) return errors
      !this.$v.task.schedule.weekly.required && errors.push('Please select a frequency!')
      return errors
    },
    scheduleSpecificDaysErrors () {
      const errors = []
      if (!this.$v.task.schedule.specificDays.$dirty) return errors
      !this.$v.task.schedule.specificDays.required && errors.push('Please select a frequency!')
      return errors
    },
    scheduleOnceErrors () {
      const errors = []
      if (!this.$v.task.schedule.once.$dirty) return errors
      !this.$v.task.schedule.once.required && errors.push('Please select a periodicity for your single task!')
      return errors
    },
    periodicity: function () {
      return this.schedule.active
    },
    scheduleChange: function () {
      return this.task.schedule
    },
    options () {
      return {
        duration: 500,
        offset: 0,
        easing: 'easeInOutCubic'
      }
    }
  },
  watch: {
    periodicity () {
      this.task.schedule.periodicity = Object.values(this.schedule.tabs)[this.schedule.active].name
    },
    scheduleChange: {
      handler (val, oldVal) {
        // Slot Generator
        const slotsGenerator = n => {
          this.task.completion = []
          for (let i = 0; i < n; i++) {
            this.task.completion.push(0)
          }
        }
        // Case Weekly
        if (this.task.schedule.periodicity === 'Weekly') {
          switch (this.task.schedule.weekly) {
            case 'Everyday' :
              slotsGenerator(7)
              break
            case 'x1 time' :
              slotsGenerator(1)
              break
            case 'x2 times' :
              slotsGenerator(2)
              break
            case 'x3 times' :
              slotsGenerator(3)
              break
            case 'x4 times' :
              slotsGenerator(4)
              break
            case 'x5 times' :
              slotsGenerator(5)
              break
            case 'x6 times' :
              slotsGenerator(6)
              break
          }
        }
        if (this.task.schedule.periodicity === 'On specific days') {
          slotsGenerator(this.task.schedule.specificDays.length)
        }
        if (this.task.schedule.periodicity === 'Once') {
          if (this.task.schedule.once === 'single') {
            slotsGenerator(1)
          }
        }
        // Single -> 1
      },
      deep: true
    },
    storeDialogTask () {
      this.dialogTask = this.storeDialogTask
    },
    storeCurrentTask () {
      if (this.storeCurrentTask !== 'new') {
        const retrievedTask = JSON.parse(JSON.stringify(this.$store.state.tasks[this.storeCurrentTask]))
        this.task = retrievedTask
        this.schedule.active = this.schedule.tabs.findIndex(v => v.name === this.task.schedule.periodicity)
      }

      this.currentTask = this.storeCurrentTask
    }
  },
  methods: {
    ...mapActions({
      updateProfile: 'profile/updateProfile',
      disableFirstTimeUser: 'profile/disableFirstTimeUser',
      addNewTask: 'tasks/addNewTask',
      updateTask: 'tasks/updateTask',
      deleteTask: 'tasks/deleteTask',
      toggleTaskDialog: 'utility/toggleTaskDialog',
      setCurrentTask: 'utility/setCurrentTask'
    }),
    handleSave () {
      this.$v.task.$touch()
      if (this.$v.task.$invalid) {
        // Throw form errors
        console.log('invalid form')
      } else {
        // Validation passed
        console.log('valid form')

        // Time
        const currentTime = Date.now()
        this.task.startDate = currentTime

        // Default
        if (!this.task.description) {
          this.task.description = 'None'
        }

        if (this.storeCurrentTask !== 'new') {
          /// Edit
          const taskId = JSON.parse(JSON.stringify(this.task.id))
          const task = JSON.parse(JSON.stringify(this.task))
          this.updateTask({ taskId, task })
          this.toggleTaskDialog(false)
        } else {
          /// Save

          EventBus.$emit('closeOtherPanels', [null, null, null, null])
          this.task.id = 'newTask' + parseInt(Math.random() * 1000)
          this.addNewTask(JSON.parse(JSON.stringify(this.task)))
          this.disableFirstTimeUser()
          this.toggleTaskDialog(false)
        }
      }
    },
    handleCancel () {
      this.setCurrentTask('new')
      this.toggleTaskDialog(false)
    },
    handleCreate () {
      // Scroll
      // Reset
      this.$refs.taskForm.reset()
      this.task.subtasks = []
      this.task.schedule.specificDays = []
      this.schedule.active = 0
      this.task.schedule.active = null
      this.$v.task.$reset()
      this.setCurrentTask('new')
      this.toggleTaskDialog(true)
    },
    handleDelete (taskId) {
      this.deleteTask(taskId)
      this.toggleTaskDialog(false)
    },
    addNewSubTask () {
      // console.log(document.getElementsByClassName('v-dialog v-dialog--active')[0])
      let container = document.getElementById('taskDialog')
      container.scrollTop = 0

      const subtaskId = 'newSubtask' + parseInt(Math.random() * 1000)
      this.task.subtasks.push({
        id: subtaskId,
        name: this.newSubtask.name,
        checked: null,
        status: 'ongoing' })
      this.newSubtask.name = ''
    },
    removeSubTask (index) {
      this.task.subtasks.splice(index, 1)
    },
    subtaskErrors (subtask) {
      const errors = []
      if (!subtask.name.$dirty) return errors
      !subtask.name.required && errors.push('Please set something here')
      return errors
    }
  },
  created () {
    EventBus.$on('createTask', () => {
      this.handleCreate()
    })
  }
}
</script>

<style lang="scss">
.taskEditor {
  max-width: 400px;
  margin: auto;
  left: auto;

  h6 {
    &:not(.white--text) {
      opacity: 0.7;
    }
  }
  .v-toolbar {
    .v-toolbar__title {
      font-size: 23px !important;
    }
    .v-toolbar__title:not(:first-child) {
      margin: 0;
    }
    .v-btn {
      opacity: 0.7;
    }
  }
  // Button group
  .theme--light.v-btn-toggle {
    width: 100%;
    height: 40px;
    align-items: center;

    .v-btn {
      &--active {
        color: white;
        background-color: $color-green;
      }
      &--active:before,
      &:focus:before,
      &:hover:before {
        background-color: white;
      }
      flex-grow: 1;
      height: 100%;
    }
  }
  .dialogContainer {
    height: 100%;
  }
}
</style>
