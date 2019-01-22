<template>
  <v-dialog transition="slide-y-transition" scrollable fullscreen v-model="dialogTask">
    <v-btn slot="activator" fab small depressed absolute class="white add" @click="handleCreate">
      <v-icon class="black--text">add</v-icon>
    </v-btn>
    <v-card flat class="createTaskCard">
      <!-- Toolbar -->
      <v-toolbar dark flat class="green">
        <v-btn depressed flat @click="handleCancel">cancel</v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>New Task</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn depressed flat @click="handleSave">{{currentTask=== "new" ? 'Save' : 'Update'}}</v-btn>
      </v-toolbar>
      <v-card-text style="height: auto;">
        <!-- Form -->
        <v-container>
          <v-form ref="taskForm" lazy-validation>
            <h6 class="title my-3">Informations</h6>
            <v-text-field
              label="Title"
              v-model="task.title"
              required
              :error-messages="titleErrors"
              @input="$v.task.title.$touch()"
              @blur="$v.task.title.$touch()"
            ></v-text-field>
            <v-textarea label="Description" v-model="task.description"></v-textarea>
            <v-select
              :items="categories"
              label="Category"
              v-model="task.category"
              required
              :error-messages="categoryErrors"
              @input="$v.task.category.$touch()"
              @blur="$v.task.category.$touch()"
            ></v-select>
            <h6 class="title my-3">Schedule</h6>
            <v-tabs v-model="schedule.active" color="green" dark slider-color="yellow">
              <v-tab v-for="option in schedule.options" :key="option" ripples>{{ option }}</v-tab>
              <v-tab-item :value="0">
                <v-select
                  :items="schedule.weekly"
                  label="Choose a frequence"
                  v-model="task.schedule.weekly"
                  :error-messages="scheduleWeeklyErrors"
                ></v-select>
              </v-tab-item>
              <v-tab-item :value="1">
                <v-layout>
                  <v-flex align-self-center>
                    <v-input :error-messages="scheduleSpecificDaysErrors">
                      <v-btn-toggle class="mt-3" v-model="task.schedule.specificDays" multiple>
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
                  <v-radio label="Single task" value="single"></v-radio>
                  <v-radio label="Monthly goal" value="monthly"></v-radio>
                  <v-radio label="Yearly goal" value="yearly"></v-radio>
                </v-radio-group>
              </v-tab-item>
            </v-tabs>
            <h6 class="title my-3">Subtasks</h6>

            <div class="grey lighten-2 pa-2 pl-3" v-if="task.subtasks.length > 0">
              <v-layout v-for="(subtask,key) in $v.task.subtasks.$each.$iter" :key="subtask.id">
                <v-text-field
                  placeholder="Your new subtask"
                  :error-messages="subtaskErrors(subtask)"
                  v-model="subtask.name.$model"
                  clearable
                ></v-text-field>
                <v-btn icon depressed dark class="mt-3" color="red" @click="removeSubTask(key)">
                  <v-icon>delete_forever</v-icon>
                </v-btn>
              </v-layout>
            </div>

            <v-layout class="mt-2 pa-2 pl-3">
              <v-text-field placeholder="Add a new subtask" clearable v-model="newSubtask.name"></v-text-field>
              <v-btn icon depressed dark class="mt-3" color="green" @click="addNewSubTask">
                <v-icon>add</v-icon>
              </v-btn>
            </v-layout>
          </v-form>
          <div class="mt-4 ml-4 mr-4">
            <v-btn
              v-if="currentTask !== 'new'"
              outline
              block
              color="red"
              @click="handleDelete(task.id)"
            >Delete task</v-btn>
          </div>
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

export default {

  data () {
    return {
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
        checked: false
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
      storeCurrentTask: state => state.currentTask.id
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
    }
  },
  watch: {
    periodicity () {
      this.task.schedule.periodicity = Object.values(this.schedule.tabs)[this.schedule.active].name
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
    ...mapActions([
      'updateProfile',
      'addNewTask',
      'updateTask',
      'toggleTaskDialog',
      'closeTaskPanels',
      'setCurrentTask',
      'deleteTask'
    ]),
    handleSave () {
      this.$v.task.$touch()
      if (this.$v.task.$invalid) {
        console.log('invalid form')
      } else {
        console.log('valid form')

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
          this.updateProfile(false)
          this.toggleTaskDialog(false)
        }
      }
    },
    handleCancel () {
      this.setCurrentTask('new')
      this.toggleTaskDialog(false)
    },
    handleCreate () {
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
    EventBus.$on('createFirstTask', () => {
      this.handleCreate()
    })
  }
}
</script>

<style>
.v-btn.v-btn--absolute.add {
  right: 14px;
  top: 14px;
}

.v-dialog {
  max-width: 400px;
  margin: auto;
  left: auto;
}
</style>
