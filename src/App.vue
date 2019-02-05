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
    ...mapState('profile', {
      profile: state => state
    }),
    ...mapGetters({
      'userData': 'profile/getProfileData'
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
  },
  methods: {
    ...mapActions({
      'updateProfile': 'profile/updateProfile'
    })
  },
  created () {
    // Set last connexion date (relay)
    this.userData.connexionDateLast = this.userData.connexionDateCurrent
    // Update current connexion date
    const currentTime = Date.now()
    this.userData.connexionDateCurrent = currentTime
    this.updateProfile(this.userData)
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
