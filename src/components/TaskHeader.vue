<template>
  <header>
    <v-toolbar dark app class="taskHeader secondary">
      <v-toolbar-title class="primary--text font-weight-bold">Tasks</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn fab small class="colorGreen">
        <v-icon class="icon icon-add"></v-icon>
      </v-btn>
      <TasksProgress slot="extension" class="TasksProgressWrapper"/>
    </v-toolbar>
  </header>
</template>

<script>
// import TasksCreateTask from '@/components/TasksCreateTask'
import TasksProgress from '@/components/TasksProgress'

export default {
  components: {
    // TasksCreateTask
    TasksProgress
  },
  props: {
    profile: {
      required: true,
      type: Object
    }
  }

}
</script>

<style lang="scss">
.taskHeader {
  padding-top: 10px;
  .v-toolbar__content {
    //height: 56px;
  }
}

.v-toolbar {
  max-width: 400px;
  margin: auto;
  left: auto;

  .v-toolbar__title {
    font-size: 27px !important;
  }

  .v-btn--floating.v-btn--small {
    height: 30px;
    width: 30px;
  }
}

.TasksProgressWrapper {
  height: auto;
}

.v-toolbar__extension {
  height: auto !important;
  padding: 0;
}
</style>
