<template>
  <div>
    <TheNavbar/>
    <v-container fluid>
      <div v-for="(periodicity,key) in periodicities" :key="key">
        <v-subheader>{{periodicity.name}}</v-subheader>
        <TasksFiltered :periodicity="periodicity" :tasks="tasks"/>
      </div>
    </v-container>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import TasksFiltered from '@/components/TasksFiltered'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TheNavbar,
    TasksFiltered
  },
  computed: {
    ...mapState([
      'tasks', 'periodicities'
    ]),
    ...mapGetters([
      'allTasks'
    ])

  },
  methods: {
    ...mapActions([
      'addNewTask'
    ]),
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
