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
    <div class="dimmer">
      <div class="dimmer__content white--text display-1 font-weight-medium">TAP TO PASS</div>
    </div>
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
.dimmer {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(black, 0.3);

  &__content {
    position: relative;
    display: block;
    text-align: center;
    margin: auto;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
