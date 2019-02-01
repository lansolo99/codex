<template>
  <div>
    <TaskHeader :profile="profile"/>
    <v-container fluid class="mb-5">
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
import { EventBus } from '@/bus'
import { mapState } from 'vuex'

export default {
  components: {
    TaskHeader,
    TasksWelcome,
    TasksEditor,
    TasksList
  },
  data () {
    return {
      beginnerTutorial: {
        status: 'off',
        currentTooltip: null
      }
    }
  },
  computed: {
    ...mapState([
      'periodicities', 'tasks', 'profile'
    ])
  },
  watch: {
    'beginnerTutorial.status': function () {
      this.beginnerTutorialWalkthrough()
    }
  },
  methods: {
    getTaskFilter (periodicityName) {
      return this.taskFilters.find(v => v.periodicity === periodicityName).filter
    },
    beginnerTutorialWalkthrough () {
      this.beginnerTutorial.currentTooltip += 1
      let tooltips = []
      for (let i = 0; i < 8; i++) {
        tooltips.push(false)
      }
      tooltips[this.beginnerTutorial.currentTooltip - 1] = true
      EventBus.$emit('nextTooltip', [false, false, false, false, false, false, false, false])
      if (this.beginnerTutorial.currentTooltip > 8) {
        EventBus.$emit('disableTooltips', -10)
        this.beginnerTutorial.status = 'complete'
      } else {
        setTimeout(function () { EventBus.$emit('nextTooltip', tooltips) }, 400)
      }
    }
  },
  created () {
    EventBus.$on('startBeginnerTutorial', () => {
      this.beginnerTutorial.status = 'ongoing'
    })
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
    top: 90%;
    transform: translateY(-50%);
  }
}
.disable_tooltips {
  opacity: 0 !important;
  pointer-events: none;
}
</style>
