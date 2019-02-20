<template>
  <div>
    <v-card class="welcomeCard pa-3 pl-5 pr-5 pb-4 mt-3 text-xs-center">
      <img
        src="@/assets/images/stats_init.jpg"
        srcset="@/assets/images/stats_init.jpg 1x, @/assets/images/stats_init@2x.jpg 2x"
        alt
      >
      <h2 class="mt-3 font-weight">Nothing to show!</h2>
      <p class="font-weight-light">Add a task to start tracking your progress</p>
      <v-btn block large class="mt-3 colorGreen white--text" @click="handleCreate" to="/">Add a task</v-btn>
    </v-card>
  </div>
</template>

<script>
// import { mapActions } from 'vuex'
import { EventBus } from '@/bus'
export default {
  data () {
    return {
      alert: true
    }
  },
  methods: {
    // ...mapActions({

    // }),
    handleCreate () {
      EventBus.$emit('createTask')
    }
  }
}
</script>

<style lang="scss">
.welcomeCard {
  h2 {
    font-size: 27px;
    font-weight: 600;
  }
  p {
    font-size: 16px;
    font-weight: normal;
    color: $color-anthracite;
  }
}
</style>
