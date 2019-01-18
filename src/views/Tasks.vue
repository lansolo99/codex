<template>
  <div>
    <TheNavbar/>
    <v-container fluid>
      <div v-for="(periodicity,key) in periodicities" :key="key">
        <TasksFiltered :periodicity="periodicity" :tasks="tasks"/>
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
    },
    taskCount (periodicity) {
      console.log(periodicity)
      //   for (const [i, value] of task.entries()) {
      // console.log('%d: %s', i, value);
      // }
      return 2
    }
  }
}
</script>

<style>
.test {
  background-color: grey;
}
</style>
