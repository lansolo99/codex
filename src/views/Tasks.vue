<template>
  <div>
    <TaskHeader :profile="profile"/>
    <v-container fluid class="mb-4 tasks">
      <TasksWelcome v-if="profile.firstTime"/>
      <div>
        <div class="periodicityWrapper" v-for="(periodicity,key,index) in periodicities" :key="key">
          <TasksList :periodicity="periodicity" :ind="index" :tasks="tasks"/>
        </div>
      </div>
    </v-container>
    <TasksEditor/>
  </div>
</template>

<script>
import TaskHeader from '@/components/TaskHeader'
import TasksEditor from '@/components/TasksEditor'
import TasksList from '@/components/TasksList'
import TasksWelcome from '@/components/TasksWelcome'
import { mapState } from 'vuex'

export default {
  name: 'Tasks',
  components: {
    TaskHeader,
    TasksWelcome,
    TasksEditor,
    TasksList
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'periodicities', 'tasks', 'profile'
    ])
  },
  watch: {
  },
  methods: {
    getTaskFilter (periodicityName) {
      return this.taskFilters.find(v => v.periodicity === periodicityName).filter
    }
  }
}
</script>

<style lang="scss">
.tasks {
  //padding-top: 36px !important;
}
.periodicityWrapper:first-child {
  .subheader {
    margin-top: 5px !important;
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
    top: 90%;
    transform: translateY(-50%);
  }
}
.disable_tooltips {
  opacity: 0 !important;
  pointer-events: none;
}
</style>
