<template>
  <div class="mb-5">
    <TheNavbar :profile="profile"/>
    <v-container fluid class="mb-5">
      <TasksWelcome v-if="profile.firstTime"/>
      <div>
        <div class="periodicityWrapper" v-for="(periodicity,key,index) in periodicities" :key="key">
          <TasksFiltered :periodicity="periodicity" :ind="index" :tasks="tasks"/>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import TasksFiltered from '@/components/TasksFiltered'
import TasksWelcome from '@/components/TasksWelcome'

import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    TheNavbar,
    TasksWelcome,
    TasksFiltered
  },
  computed: {
    ...mapState([
      'periodicities', 'tasks', 'profile'
    ]),
    ...mapGetters([
      'allTasks'
    ])

  },
  methods: {
    getTaskFilter (periodicityName) {
      return this.taskFilters.find(v => v.periodicity === periodicityName).filter
    }
  }
}
</script>

<style lang="scss">
.periodicityWrapper:first-child {
  .v-subheader {
    margin-top: 0px !important;
  }
}
</style>
