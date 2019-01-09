<template>
  <v-dialog transition="slide-y-transition" scrollable fullscreen v-model="dialogTask">
    <v-btn slot="activator" fab small depressed absolute class="white add">
      <v-icon class="black--text">add</v-icon>
    </v-btn>
    <v-card>
      <v-toolbar dark flat class="red">
        <v-btn depressed flat @click="dialogTask = false">cancel</v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>New Task</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn depressed flat @click="submitCreateTask">save</v-btn>
      </v-toolbar>
      <v-container>
        <v-form>
          <v-text-field label="Title" v-model="task.title"></v-text-field>
          <v-textarea label="informations" v-model="task.description"></v-textarea>
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
      task: {
        title: null,
        description: null
      }

    }
  },
  methods: {
    ...mapActions([
      'addNewTask'
    ]),
    submitCreateTask () {
      this.addNewTask(this.task)
      this.dialogTask = false
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
