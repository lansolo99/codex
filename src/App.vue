<template>
  <v-app>
    <v-content :class="toolbarConf">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import { EventBus } from '@/bus'

export default {

  name: 'App',
  data () {
    return {
      toolbarConf: 'toolbarSingle'
    }
  },
  computed: {
    ...mapState([
      'profile'
    ]),
    profileUpdate: function () {
      return this.profile
    }
  },
  watch: {
    profileUpdate: {
      handler (val, oldVal) {
        if (this.profile.firstTime === false) {
          this.toolbarConf = 'toolbarMultiple'
        }
        if (this.profile.beginnerTutorial === true) {
          EventBus.$emit('startBeginnerTutorial')
        }
      },
      deep: true
    }
  },
  mounted () {
    // comment below in real mode
    // this.toolbarConf = 'toolbarMultiple'
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 400px;
  margin: auto;
  .toolbarSingle {
    padding-top: 56px !important;
  }
  .toolbarMultiple {
    padding-top: 182px !important;
  }
}
</style>
