<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {

  name: 'App',
  data () {
    return {
    }
  },
  mounted () {
    // console.log(this.$vuetify.breakpoint)
  }
}
</script>

<style lang="scss">
#app {
  //width: 50%;
}
</style>
