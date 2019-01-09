<template>
  <div>
    <TheNavbar/>
    <v-container fluid>
      <v-card flat v-for="task in tasks" :key="task.id">
        <v-layout row wrap :class="`task ${task.status}`">
          <v-flex xs1 class="green">x</v-flex>
          <v-flex xs1 class="red">x</v-flex>
          <v-flex xs9 class="purple">{{task.title}}</v-flex>
          <v-flex xs1 class="green">x</v-flex>
        </v-layout>
      </v-card>

      <div>{{allTasks}}</div>
    </v-container>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TheNavbar
  },
  data () {
    return {
      title: 'task4',
      description: 'bla bla bla',
      frequency: '3',
      status: 'complete'
    }
  },
  computed: {
    ...mapState([
      'tasks'
    ]),
    ...mapGetters([
      'allTasks'
    ])

  },
  methods: {
    ...mapActions([
      'addNewTask'
    ])
  }
}
</script>

<style>
.test {
  background-color: grey;
}
</style>
