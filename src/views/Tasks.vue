<template>
  <div>
    <TaskHeader/>
    <v-container fluid class="mb-4 tasks" v-if="utility.tasksReady">
      <TasksWelcome v-if="profile.firstTime"/>
      <TasksReboot v-if="showReboot"/>

      <div>
        <div
          class="periodicityWrapper"
          v-for="(periodicity,key,index) in utility.periodicities"
          :key="key"
        >
          <TasksList :periodicity="periodicity" :ind="index"/>
        </div>
      </div>
      <!-- <v-btn ref="button" color="primary" block @click="$vuetify.goTo(0)">scroll</v-btn> -->
    </v-container>
    <TasksEditor/>
  </div>
</template>

<script>
import TaskHeader from '@/components/TaskHeader'
import TasksEditor from '@/components/TasksEditor'
import TasksList from '@/components/TasksList'
import TasksWelcome from '@/components/TasksWelcome'
import TasksReboot from '@/components/TasksReboot'
import { mapState } from 'vuex'
import store from '@/store/store'

export default {
  name: 'Tasks',
  components: {
    TaskHeader,
    TasksWelcome,
    TasksReboot,
    TasksEditor,
    TasksList
  },
  data () {
    return {
      showReboot: false
    }
  },
  computed: {
    ...mapState({
      tasks: state => state.tasks,
      utility: state => state.utility,
      profile: state => state.profile
    }),
    tasksProfilecombined () {
      return this.tasks && this.profile
    }
  },
  watch: {
    tasksProfilecombined: {
      handler (val, oldVal) {
        // Show reboot panel
        if ((!Object.keys(this.tasks).length || Object.keys(this.tasks).length === 0) && !this.profile.firstTime) {
          this.showReboot = true
        } else {
          this.showReboot = false
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getTaskFilter (periodicityName) {
      return this.taskFilters.find(v => v.periodicity === periodicityName).filter
    }
  },
  mounted () {
    // $vuetify.goTo(0)
  },
  beforeRouteEnter (to, from, next) {
    if (store.state.utility.authUserID) {
      next()
    } else {
      next({ name: 'login' })
    }
  }
}
</script>

<style lang="scss">
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
