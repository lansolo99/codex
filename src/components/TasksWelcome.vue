<template>
  <div>
    <v-card class="welcomeCard pa-3 pl-5 pr-5 pb-4">
      <img
        src="@/assets/images/startup_illustration.jpg"
        srcset="@/assets/images/startup_illustration.jpg 1x, @/assets/images/startup_illustration@2x.jpg 2x"
        alt
      >
      <h2 class="mt-3 font-weight">Welcome!</h2>
      <p
        class="font-weight-light"
      >This is your routine board, the place you’ll set all your habits/goals.</p>
      <p class="font-weight-light">Your journey starts after creating your first task</p>
      <v-btn
        block
        large
        class="mt-3 colorGreen white--text"
        @click="handleCreate"
      >Add your first task</v-btn>
    </v-card>
  </div>
</template>

<script>
import { EventBus } from '@/bus'
export default {
  data () {
    return {
      alert: true
    }
  },
  methods: {
    handleCreate () {
      EventBus.$emit('createFirstTask')
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
