<template>
  <header>
    <v-toolbar dark app class="taskHeader secondary">
      <TheStatusBar/>
      <v-toolbar-title class="primary--text font-weight-bold">Tasks</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn fab small class="colorGreen" @click="handleCreate">
        <v-icon class="icon icon-add"></v-icon>
      </v-btn>
      <TasksProgress slot="extension" class="TasksProgressWrapper"/>
    </v-toolbar>
  </header>
</template>

<script>
import TasksProgress from '@/components/TasksProgress'
import TheStatusBar from '@/components/TheStatusBar'
import { EventBus } from '@/bus'
export default {
  components: {
    TasksProgress,
    TheStatusBar
  },
  methods: {
    handleCreate () {
      EventBus.$emit('createTask')
    }
  }

}
</script>

<style lang="scss">
.taskHeader {
  padding-top: 10px;
  padding-top: 50px;

  &.v-toolbar {
    margin: auto;
    left: auto;

    .v-toolbar__title {
      font-size: 30px !important;
      margin: 5px !important;
    }
  }

  .TasksProgressWrapper {
    height: auto;
  }

  .v-toolbar__extension {
    height: auto !important;
    padding: 0;
  }
}
</style>
