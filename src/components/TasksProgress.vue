<template>
  <v-container class="taskProgress pt-0 pb-2">
    <v-layout v-if="utility.appReady">
      <v-flex xs12>
        <v-card
          flat
          height="100%"
          class="taskProgressContainer taskProgressContainer--bars taskProgressContainer--week transparent"
        >
          <span class="label white--text">
            <span class="week">Week {{time.currentUserWeek}} completion</span> |
            <span class="day primary--text">{{ getStringDay }}</span>
          </span>
          <div class="progressbarContainer">
            <v-progress-linear
              v-model="userData.stats.progressWeek"
              height="15"
              class="mt-2"
              width="80%"
            ></v-progress-linear>
            <div
              class="progressbarContainer__value white--text text-xs-right"
            >{{userData.stats.progressWeek || 0}}%</div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// eslint-disable-next-line
import { countObjectProperties, getIsoDayFromString, getStringFromIsoDay } from '@/utils'
// eslint-disable-next-line
import { getISODay, isThisWeek, getISOWeek} from 'date-fns'
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
      .day {
        font-size: 14px;
        padding-left: 5px;
      }
      .week {
        padding-right: 5px;
      }
      font-size: 16px;
    }
    &--bars {
      padding-right: 60px !important;
    }

    &--week {
      position: relative;
      left: 5px;
    }

    .progressbarContainer {
      position: relative;
      top: -4px;
      &__value {
        position: absolute;
        top: -5px;
        right: -45px;
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
