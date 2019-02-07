<template>
  <v-app class="primary">
    <v-content :class="toolbarConf">
      <router-view/>
    </v-content>
    <TheNavbar/>
  </v-app>
</template>

<script>
// eslint-disable-next-line
import { format, getISODay, isToday, isThisWeek, getISOWeek, getTime  } from 'date-fns'
import { EventBus } from '@/bus'
import TheNavbar from '@/components/TheNavbar'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      toolbarConf: 'toolbarTasks'
    }
  },
  components: {
    TheNavbar
  },
  computed: {
    ...mapState('tasks', {
      tasks: state => state
    }),
    ...mapState('time', {
      time: state => state
    }),
    ...mapGetters({
      'userData': 'profile/getProfileData'
    })
  },
  watch: {
    '$route': {
      immediate: true,
      handler (newVal, oldVal) {
        if (this.$route.path === '/') {
        // Tasks
          this.toolbarConf = 'toolbarTasks'
        } else {
          this.toolbarConf = 'toolbarNone'
        }
      }

    }
  },
  methods: {
    ...mapActions({
      updateProfile: 'profile/updateProfile',
      updateTask: 'tasks/updateTask',
      rebootWeeklyTasksCompletions: 'tasks/rebootWeeklyTasksCompletions'
    })
  },
  mounted () {
    // Update stats
    EventBus.$emit('recordProgress')
  },
  created () {
    // console.log(getTime(new Date(2019, 0, 2, 11, 45, 5, 123)))

    // LAST CONNEXION UPDATES
    console.log('connexionDateLast before update = ' + format(new Date(this.userData.connexionDateLast), 'DD/MM/YYYY'))

    // Completions reset
    if (!isThisWeek(this.userData.connexionDateLast)) {
      console.log('is not this week')
      this.rebootWeeklyTasksCompletions()
    }

    // Check reset & guards
    const copiedTasks = JSON.parse(JSON.stringify(this.tasks))
    // Loop
    for (let [key, value] of Object.entries(copiedTasks)) {
      // Weekly
      if (value.schedule.periodicity === 'Weekly') {
        // Everyday
        if (value.schedule.weekly === 'Everyday') {
          // Reset check
          if (!isToday(this.userData.connexionDateLast)) {
            value.checked = false
          }
        }
      }
      console.log('test')
      const taskId = JSON.parse(JSON.stringify(key))
      const task = JSON.parse(JSON.stringify(value))
      this.updateTask({ taskId, task })
    }

    // Update connexionDateLast
    this.userData.connexionDateLast = Date.now()
    console.log('connexionDateLast after update = ' + format(new Date(this.userData.connexionDateLast), 'DD/MM/YYYY'))
    this.updateProfile(this.userData)
  }

}

</script>

<style lang="scss">
// Mixins
@include btnFabCustom;

#app {
  font-family: "Signika", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 400px;
  margin: auto;
}
.toolbarNone {
  padding-top: 0px !important;
}
.toolbarTasks {
  padding-top: 132px !important;
}
</style>
