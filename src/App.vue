<template>
  <v-app class="primary">
    <v-content :class="toolbarConf">
      <router-view/>
    </v-content>
    <TheNavbar/>
  </v-app>
</template>

<script>
import { EventBus } from '@/bus'
import TheNavbar from '@/components/TheNavbar'
import { mapGetters, mapActions } from 'vuex'

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
      'updateProfile': 'profile/updateProfile'
    })
  },
  mounted () {
    // Update stats
    EventBus.$emit('recordProgress')
  },
  created () {
    // Set last connexion from current + update current
    this.userData.connexionDateLast = this.userData.connexionDateCurrent
    this.userData.connexionDateCurrent = Date.now()
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
