<template>
  <v-app>
    <v-content :class="toolbarConf">
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
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
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
#app {
  .toolbarSingle {
    padding-top: 56px !important;
  }
  .toolbarMultiple {
    padding-top: 182px !important;
  }
}
</style>
