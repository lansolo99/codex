<template>
  <div class="mb-5">
    <TheNavbar/>
    <v-container fluid class="mb-5">
      <TasksProgress/>
      <div v-for="(periodicity,key) in periodicities" :key="key">
        <TasksFiltered :periodicity="periodicity" :tasks="tasks"/>
      </div>
    </v-container>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import TasksFiltered from '@/components/TasksFiltered'
import TasksProgress from '@/components/TasksProgress'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    TheNavbar,
    TasksProgress,
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

<style>
.test {
  background-color: grey;
}
</style>
