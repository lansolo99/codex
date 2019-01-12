<template>
  <v-expansion-panel>
    <v-expansion-panel-content v-for="(task,key) in filterTasks(periodicity.name)" :key="key">
      <v-layout slot="header" row wrap :class="`task ${task.status}`">
        <v-flex xs1 class="green">x</v-flex>
        <v-flex xs1 class="red">x</v-flex>
        <v-flex xs9 class="purple">{{task.title}}</v-flex>
        <v-flex xs1 class="green">x</v-flex>
      </v-layout>
      <v-card>
        <v-card-text>
          <ul>
            <li>{{task.description}}</li>
            <li>{{task.schedule.periodicity}}</li>
            <li>{{task.category}}</li>
          </ul>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  props: {
    tasks: {
      required: true,
      type: Object
    },
    periodicity: {
      required: true,
      type: Object
    }
  },
  methods: {
    filterTasks (periodicityStr) {
      return Object.values(this.tasks)
        .filter(task => {
          if (periodicityStr === 'Weeklies') {
            return task.schedule.periodicity === 'Weekly'
          } else if (periodicityStr === 'Monthlies') {
            return task.schedule.periodicity === 'Once' && task.schedule.once === 'monthly'
          } else if (periodicityStr === 'Yearlies') {
            return task.schedule.periodicity === 'Once' && task.schedule.once === 'yearly'
          } else if (periodicityStr === 'Singles') {
            return task.schedule.periodicity === 'Once' && task.schedule.once === 'single'
          }
        })
    }
  }
}
</script>

<style>
</style>
