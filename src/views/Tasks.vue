<template>
  <div class="mb-5">
    <TheNavbar/>
    <v-container fluid class="mb-5 mt-5">
      <div v-for="(periodicity,key,index) in periodicities" :key="key">
        <TasksFiltered :periodicity="periodicity" :ind="index" :tasks="tasks"/>
      </div>
    </v-container>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import TasksFiltered from '@/components/TasksFiltered'

import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    TheNavbar,
    TasksFiltered
  },
  computed: {
    ...mapState([
      'periodicities', 'tasks'
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
