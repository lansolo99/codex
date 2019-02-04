<template>
  <v-app class="primary">
    <v-content :class="toolbarConf">
      <router-view/>
    </v-content>
    <TheNavbar/>
  </v-app>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import { mapState } from 'vuex'

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
    ...mapState('profile', {
      profile: state => state
    }),
    profileUpdate: function () {
      return this.profile
    }
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

    },
    profileUpdate: {
      handler (val, oldVal) {
        if (this.profile.firstTime === false) {
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
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
