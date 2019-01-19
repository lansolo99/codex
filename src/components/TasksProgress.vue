<template>
  <v-container class="pa-0">
    <v-layout>
      <v-flex xs4 text-xs-center>
        <v-card flat height="100%" class="taskProgressContainer green darken-2 pa-3 pt-4">
          <v-avatar>
            <v-icon size="50px" dark>account_circle</v-icon>
          </v-avatar>
          <div class="white--text mt-1">LEVEL 0/100</div>
        </v-card>
      </v-flex>
      <v-flex xs8>
        <v-card
          flat
          height="100%"
          class="taskProgressContainer taskProgressContainer--bars green darken-0 pa-3"
        >
          <span class="white--text">TODAY</span>
          <div class="progressbarContainer">
            <v-progress-linear v-model="progressToday" color="white" class="mt-2" width="80%"></v-progress-linear>
            <div class="progressbarContainer__value white--text text-xs-right">50%</div>
          </div>
          <span class="white--text">THIS WEEK</span>
          <div class="progressbarContainer">
            <v-progress-linear v-model="progressWeek" color="white" class="mt-2 mb-2"></v-progress-linear>
            <div class="progressbarContainer__value white--text text-xs-right">4%</div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      progressToday: 50,
      progressWeek: 4
    }
  }
}
</script>

<style lang="scss">
.taskProgressContainer {
  border-radius: 0 !important;
  &--bars {
    padding-right: 50px !important;
  }

  .progressbarContainer {
    position: relative;
    &__value {
      position: absolute;
      top: -7px;
      right: -34px;
    }
  }
}
</style>
