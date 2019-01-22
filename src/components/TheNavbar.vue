<template>
  <nav>
    <v-toolbar dark app flat class="green">
      <v-spacer></v-spacer>
      <v-toolbar-title>Today</v-toolbar-title>
      <v-spacer></v-spacer>
      <TasksCreateTask/>
      <TasksProgress v-if="!profile.firstTime" slot="extension" class="blue TasksProgressWrapper"/>
    </v-toolbar>
  </nav>
</template>

<script>
import TasksCreateTask from '@/components/TasksCreateTask'
import TasksProgress from '@/components/TasksProgress'

export default {
  components: {
    TasksCreateTask,
    TasksProgress
  },
  props: {
    profile: {
      required: true,
      type: Object
    }
  },
  data: () => ({
    items: [
      { title: 'Today', route: '/' },
      { title: 'Stats', route: '/stats' }
    ]
  })

}
</script>

<style lang="scss">
.v-toolbar__title:not(:first-child) {
  margin-left: 0px;
}
.v-toolbar {
  max-width: 400px;
  margin: auto;
  left: auto;

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
