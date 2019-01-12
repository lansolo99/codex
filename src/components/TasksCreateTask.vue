<template>
  <v-dialog transition="slide-y-transition" scrollable fullscreen v-model="dialogTask">
    <v-btn slot="activator" fab small depressed absolute class="white add" @click="resetTaskForm">
      <v-icon class="black--text">add</v-icon>
    </v-btn>
    <v-card>
      <!-- Toolbar -->
      <v-toolbar dark flat class="red">
        <v-btn depressed flat @click="handleCancel">cancel</v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>New Task</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn depressed flat @click="handleSave">save</v-btn>
      </v-toolbar>
      <!-- Form -->
      <v-container>
        <v-form ref="taskForm" lazy-validation>
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
          <v-tabs v-model="schedule.active" color="cyan" dark slider-color="yellow">
            <v-tab v-for="option in schedule.options" :key="option" ripples>{{ option }}</v-tab>
            <v-tab-item>
              <v-select
                :items="schedule.weekly"
                label="Choose a frequence"
                v-model="task.schedule.weekly"
                :error-messages="scheduleWeeklyErrors"
              ></v-select>
            </v-tab-item>
            <v-tab-item>
              <v-layout>
                <v-input :error-messages="scheduleSpecificDaysErrors">
                  <v-btn-toggle v-model="task.schedule.specificDays" multiple>
                    <v-btn flat value="Monday">M</v-btn>
                    <v-btn flat value="Tuesday">T</v-btn>
                    <v-btn flat value="Wednesday">W</v-btn>
                    <v-btn flat value="Thursday">T</v-btn>
                    <v-btn flat value="Friday">F</v-btn>
                    <v-btn flat value="Saturday">S</v-btn>
                    <v-btn flat value="Sunday">S</v-btn>
                  </v-btn-toggle>
                </v-input>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
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
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, requiredIf } from 'vuelidate/lib/validators'

export default {

  data () {
    return {
      dialogTask: false,
      categories: [
        'Fitness',
        'Nutrition',
        'Skills',
        'Finance',
        'Eduction',
        'Lifestyle'
      ],
      schedule: {
        active: null,
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
      task: {
        title: null,
        description: null,
        category: null,
        schedule: {
          periodicity: null,
          weekly: null,
          specificDays: [],
          once: null
        },
        subtasks: null,
        status: 'ongoing'
      }

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
      }
    }
  },
  computed: {
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
    }
  },
  methods: {
    ...mapActions([
      'addNewTask'
    ]),
    handleSave () {
      this.$v.task.$touch()
      if (this.$v.task.$invalid) {
        console.log('invalid form')
      } else {
        console.log('valid form')
        // this.addNewTask({ ...this.task })
        this.addNewTask(JSON.parse(JSON.stringify(this.task)))
        this.dialogTask = false
      }
    },
    handleCancel () {
      this.dialogTask = false
      this.resetTaskForm()
    },
    resetTaskForm () {
      this.$refs.taskForm.reset()
      this.$v.task.$reset()
    }
  }
}
</script>

<style>
.v-btn.v-btn--absolute.add {
  right: 14px;
  top: 14px;
}
</style>
