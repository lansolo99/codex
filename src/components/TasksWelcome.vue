<template>
  <div>
    <v-alert v-model="alert" dismissible color="info" class="px-5 pt-4">
      <v-avatar>
        <v-icon size="80px" dark>schedule</v-icon>
      </v-avatar>
      <p class="text mt-2">
        Welcome to your daily board, the place where you'll set all your habits, goals.
        Your journey starts after creating your first task!
      </p>
    </v-alert>
    <v-btn block large class="mt-3 green white--text" @click="handleCreate">Add your first task</v-btn>
    <v-divider class="divider-scaffold mt-5" v-for="n in 5" :key="n"></v-divider>
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
.v-alert {
  .v-avatar {
    display: block;
    width: auto !important;
    height: auto !important;
  }
  .text {
    font-size: 18px;
    text-align: center;
  }
  .v-alert__dismissible {
    position: absolute;
    top: 15px;
    right: 15px;
  }
}
</style>
