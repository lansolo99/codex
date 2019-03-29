<template>
  <v-container class="taskProgress pt-0 pb-2">
    <v-layout v-if="utility.appReady">
      <v-flex xs6>
        <v-card
          flat
          height="100%" class="taskProgressContainer transparent pr-4 pl-1"
        >
          <span class="label white--text">
            <span>{{ getStringDay }}</span>
          </span>
        <v-layout>
          <v-flex xs9>
            <div class="progressbarContainer">
            <v-progress-linear
              v-model="userData.stats.progressWeek"
              height="15"
              class="mt-2"
            ></v-progress-linear>
            </div>
          </v-flex>
          <v-flex xs3>
            <div
              class="progressbarContainer__value white--text pl-2"
            >{{userData.stats.progressWeek || 0}}%</div>
          </v-flex>
        </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-card
          flat
          height="100%" class="taskProgressContainer transparent pl-3"
        >
          <span class="label white--text">
            <span>Week {{time.currentUserWeek}}</span>
          </span>
        <v-layout>
          <v-flex xs9>
            <div class="progressbarContainer">
            <v-progress-linear
              v-model="userData.stats.progressWeek"
              height="15"
              class="mt-2"
            ></v-progress-linear>
            </div>
          </v-flex>
          <v-flex xs3>
            <div
              class="progressbarContainer__value white--text pl-2"
            >{{userData.stats.progressWeek || 0}}%</div>
          </v-flex>
        </v-layout>
        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
// eslint-disable-next-line
import { getStringFromIsoDay } from '@/utils'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      dataReady: false,
      test: 1
    }
  },
  computed: {
    ...mapState({
      profile: state => state.profile,
      tasks: state => state.tasks,
      time: state => state.time,
      utility: state => state.utility
    }),
    ...mapGetters({
      userData: 'profile/getProfileData'
    }),
    profileTest () {
      return this.userData
    },
    tasksChecked: function () {
      return this.tasks
    },
    getStringDay () {
      return getStringFromIsoDay(this.time.isoDay)
    }
  },
  methods: {
    ...mapActions({
      updateTime: 'time/updateTime',
      recordWeekScore: 'profile/recordWeekScore',
      updateProfile: 'profile/updateProfile'
    })

  }
}
</script>

<style lang="scss">
.taskProgress {
  .taskProgressContainer {
    text-align: left;
    border-radius: 0 !important;

    .label {
      font-size: 14px;
      text-transform: uppercase;
      opacity: 0.7;
    }

    .progressbarContainer {
      position: relative;
      top: -4px;
      &__value {
        position: relative;
        top: 1px;
      }
    }
    .v-progress-linear__bar__determinate {
      @include progress-linear-fill;
    }
    .v-progress-linear__background {
      @include progress-linear-background;
    }
  }

  .v-tooltip__content {
    background-color: white;
    font-size: 16px;
    opacity: 1 !important;
    padding: 0px;
    &-title {
      font-size: 17px;
      font-weight: bold;
      display: block;
      padding: 5px 10px;
    }
    &-plain {
      display: block;
      padding: 10px;
      font-size: 15px;
      color: #333333;
    }
  }
}
</style>
