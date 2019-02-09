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
              :value="levels.trends. last10Weeks.value"
              :labels="levels.trends. last10Weeks.labels"
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
            :value="levels.trends.last10Weeks.value"
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
        profile: this.setProfileLevel,
        progressLevel: 50,
        trends: {
          gradients: [
            ['#56E39F', '#FFBA4C']
          ],
          last10Weeks: {
            labels: [
              'W11',
              'W11',
              'W11',
              'W11',
              'W11',
              'W11',
              'W11',
              'W11',
              'W11',
              'W11'
            ],
            value: [
              20,
              100,
              80,
              100,
              100,
              30,
              100,
              80,
              40,
              100
            ]
          }
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
    }
  },
  methods: {
    generateData (count, yrange) {
      var i = 0
      var series = []
      while (i < count) {
        var x = (i + 1).toString()
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min

        series.push({
          x: x,
          y: y
        })
        i++
      }
      return series
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
