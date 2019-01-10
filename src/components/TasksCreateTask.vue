<template>
  <v-dialog transition="slide-y-transition" scrollable fullscreen v-model="dialogTask">
    <v-btn slot="activator" fab small depressed absolute class="white add">
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
        <v-form ref="taskForm">
          <v-text-field label="Title" v-model="task.title"></v-text-field>
          <v-textarea label="informations" v-model="task.description"></v-textarea>
          <v-select :items="categories" label="Category" v-model="task.category"></v-select>
          <v-tabs v-model="schedule.active" color="cyan" dark slider-color="yellow">
            <v-tab v-for="option in schedule.options" :key="option" ripples>{{ option }}</v-tab>
            <v-tab-item>
              <v-select
                :items="schedule.weekly"
                label="Choose a frequence"
                v-model="task.schedule.weekly"
              ></v-select>
            </v-tab-item>
            <v-tab-item>
              <v-layout row>
                <v-checkbox v-model="task.schedule.specificDays" value="Monday"></v-checkbox>
                <v-checkbox v-model="task.schedule.specificDays" value="Tuesday"></v-checkbox>
                <v-checkbox v-model="task.schedule.specificDays" value="Wednesday"></v-checkbox>
                <v-checkbox v-model="task.schedule.specificDays" value="Thurdsay"></v-checkbox>
                <v-checkbox v-model="task.schedule.specificDays" value="Friday"></v-checkbox>
                <v-checkbox v-model="task.schedule.specificDays" value="Saturday"></v-checkbox>
                <v-checkbox v-model="task.schedule.specificDays" value="Sunday"></v-checkbox>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-radio-group v-model="task.schedule.once" column>
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
          periodicity: '',
          // periodicity: Object.values(this.schedule.tabs)[this.schedule.active].name,
          weekly: null,
          specificDays: [],
          once: null
        },
        subtasks: null,
        status: 'ongoing'
      }

    }
  },
  computed: {
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
      this.addNewTask(this.task)
      this.dialogTask = false
      this.resetTaskForm()
    },
    handleCancel () {
      this.dialogTask = false
      this.resetTaskForm()
    },
    resetTaskForm () {
      this.$refs.taskForm.reset()
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
