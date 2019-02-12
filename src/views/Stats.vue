<template>
  <div class="stats mb-4">
    <v-container class="stats">
      <h1 class="black--text">Stats</h1>
      <h6 class="subheader subheader--first my-3 black--text">Levels</h6>
      <v-card>
        <!-- Profile Level -->
        <v-container class="secondary pa-3 ma-0">
          <span class="label white--text">Profile level</span>
          <v-layout row wrap>
            <v-flex grow align-self-center>
              <span class="profileScore white--text">{{setProfileLevel}}/100</span>
            </v-flex>
            <v-flex shrink align-self-center>
              <v-dialog v-model="dialogHelpProfile" max-width="350" content-class="standard-dialog">
                <v-btn slot="activator" fab small class="primary help mr-0">
                  <v-icon class="icon icon-question_mark white--text"></v-icon>
                </v-btn>
                <v-card>
                  <v-card-title class="title primary white--text" primary-title>Profile level
                    <v-icon
                      right
                      class="white--text icon icon-delete close"
                      @click="dialogHelpProfile = false"
                    ></v-icon>
                  </v-card-title>
                  <v-card-text>Your global level is based on the weekly scores achieved during the last 10 weeks. It can go up and down, it depends entirely to your discipline commitment throughout this time.</v-card-text>
                </v-card>
              </v-dialog>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex groww>
              <v-progress-linear v-model="setProfileLevel" height="15" class="mt-2" width="80%"></v-progress-linear>
            </v-flex>
          </v-layout>
        </v-container>
        <!-- Last 10 weeks -->
        <v-container>
          <span class="label">Last 10 weeks completion history (%)</span>
          <v-sheet color="mb-3" elevation="0">
            <v-sparkline
              class="sparkline sparkline--last10Weeks"
              :labels="setRecordWeeksLabels"
              :value="setRecordWeeksValues"
              :stroke-linecap="'round'"
              :gradient="levels.trends.gradients[0]"
              :smooth="true"
              line-width="4"
              padding="16"
              height="75"
              auto-draw
            ></v-sparkline>
            <template slot="label" slot-scope="item">
              {{ item.value
              }}
            </template>
          </v-sheet>
          <v-sparkline
            class="sparkline sparkline--values"
            :value="setRecordWeeksValues"
            padding="16"
            height="10"
          >
            <template slot="label" slot-scope="item">{{ item.value }}</template>
          </v-sparkline>
        </v-container>
      </v-card>
      <h6 class="subheader my-3 mt-4 black--text">Tasks distribution chart</h6>
      <v-card>
        <v-container class="pa-3">
          <span class="label">Weeklies</span>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'Stats',
  data () {
    return {
      dialogHelpProfile: null,
      levels: {
        trends: {
          gradients: [
            ['#56E39F', '#FFBA4C']
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      'userData': 'profile/getProfileData'
    }),
    setProfileLevel () {
      let weeksRecord = []
      for (let value of Object.values(this.userData.stats.weeksRecords)) {
        weeksRecord.push(value)
      }
      const total = Math.round(weeksRecord.slice(-10).reduce((a, b) => a + b) / 10)
      return total
    },
    setRecordWeeksLabels () {
      let labels = []

      for (let label of Object.keys(this.userData.stats.weeksRecords)) {
        labels.push(label)
      }
      return labels.slice((labels.length - 10), labels.length)
    },
    setRecordWeeksValues () {
      let values = []
      for (let value of Object.values(this.userData.stats.weeksRecords)) {
        values.push(value)
      }
      return values.slice((values.length - 10), values.length)
    }
  }
}
</script>

<style lang="scss">
.stats {
  h1 {
    font-size: 30px;
    opacity: 0.7;
  }
  h6.subheader {
    opacity: 0.7;
    margin-top: 35px !important;
    &--first {
      margin-top: 20px !important;
    }
  }

  .v-card {
    .label {
      opacity: 0.7;
      font-size: 15px;
      font-weight: 600;
    }

    .profileScore {
      font-size: 29px;
    }
    // Progressbar
    .v-progress-linear__bar__determinate {
      @include progress-linear-fill;
    }
    .v-progress-linear__background {
      @include progress-linear-background;
    }
    // Sparklines
    .sparkline {
      overflow: visible;
      text {
        font-size: 13px;
        color: rgba(black, 0.6);
      }
      g {
        dominant-baseline: hanging !important;
        transform: translateY(10px);
      }
      &--last10Weeks {
        text {
          font-size: 11px;
        }
      }
      &--values {
        position: relative;
        top: -20px;
        text {
          font-size: 11px;
          color: rgba(black, 1);
        }
        path {
          display: none !important;
        }
      }
    }
  }
}
.standard-dialog {
  .v-card__title {
    font-weight: 600;
  }
  .v-card__text {
    font-size: 16px;
    font-weight: 400;
  }
  .close {
    position: absolute;
    top: 20px;
    right: 15px;
  }
}
</style>
