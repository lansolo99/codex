<template>
  <header>
    <v-toolbar dark app class="taskHeader secondary">
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
import { EventBus } from '@/bus'
export default {
  components: {
    TasksProgress
  },
  props: {
    profile: {
      required: true,
      type: Object
    }
  },
  methods: {
    handleCreate () {
      EventBus.$emit('createFirstTask')
    }
  }

}
</script>

<style lang="scss">
.taskHeader {
  padding-top: 10px;

  &.v-toolbar {
    max-width: 400px;
    margin: auto;
    left: auto;

    .v-toolbar__title {
      font-size: 30px !important;
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
