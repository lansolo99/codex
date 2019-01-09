<template>
  <nav>
    <v-toolbar dark app flat class="red">
      <v-spacer></v-spacer>
      <v-toolbar-title>Today</v-toolbar-title>
      <v-spacer></v-spacer>
      <TasksCreateTask/>
    </v-toolbar>
  </nav>
</template>

<script>
import TasksCreateTask from '@/components/TasksCreateTask'

export default {
  components: {
    TasksCreateTask
  },
  data: () => ({
    items: [
      { title: 'Today', route: '/' },
      { title: 'Stats', route: '/stats' }
    ]
  }),

  props: {
    source: String
  },
  methods: {
    displayCreateTask () {
      console.log('displayCreateTask')
    }
  }

}
</script>

<style lang="scss">
.v-toolbar__title:not(:first-child) {
  margin-left: 0px;
}
.v-toolbar {
  .v-btn--floating.v-btn--small {
    height: 30px;
    width: 30px;
  }
}
</style>
