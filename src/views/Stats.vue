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
          <div class="dailyCompletionsWrapper">
            <apexcharts
              type="bar"
              width="100%"
              :height="taskCompletions.height"
              :options="taskCompletions.chartOptions"
              :series="taskCompletions.series"
            />
          </div>
        </v-container>
      </v-card>
      <h6 class="subheader my-3 mt-4 black--text">Long term metrics</h6>
      <v-card>
        <v-container class="longTermsMetrics pa-3">
          <v-layout class="py-2">
            <v-flex grow>
              <span class="label">Passed weeks</span>
            </v-flex>
            <v-flex shrink>
              <span class="value">14W</span>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout class="py-2">
            <v-flex grow>
              <span class="label">Average weekly completion</span>
            </v-flex>
            <v-flex shrink>
              <span class="value">83%</span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

export default {
  name: 'Stats',
  components: {
    apexcharts: VueApexCharts
  },
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
      },
      taskCompletions: {
        height: 500,
        series: [{
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 500, 500]
        }],
        chartOptions: {
          chart: {
            stackType: '100%',
            toolbar: {
              show: false
            }
          },
          plotOptions: {
            bar: {
              barHeight: '100%',
              distributed: true,
              horizontal: true,
              dataLabels: {
                position: 'bottom'
              }
            }
          },
          colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
            '#f48024', '#69d2e7'
          ],
          dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
              colors: ['#fff']
            },
            formatter: function (val, opt) {
              return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
            },
            offsetX: 0
          },
          stroke: {
            width: 0,
            colors: ['#fff']
          },
          tooltip: {
            enabled: false
          },
          legend: {
            show: false
          },
          xaxis: {
            show: false,
            labels: {
              show: false
            },
            categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
              'United States', 'China', 'India'
            ],
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            }
          },
          yaxis: {

            labels: {
              show: false
            }
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
      console.log('test')

      for (let value of Object.values(this.userData.stats.weeksRecords)) {
        console.log(value)
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
    // Apexchart
    .dailyCompletionsWrapper {
      margin-top: 10px;
      overflow: hidden;
      width: 100%;
      .apexcharts-canvas {
        position: relative;
        margin-top: 5px;
        pointer-events: none;
      }
      .apexcharts-inner {
        transform: translate(0) !important;
      }
      .apexcharts-xaxis-label {
        color: black;
        opacity: 0.6;
      }
      .apexcharts-series path {
        height: 40px !important;
      }
    }
    //Long terms metrics
    .longTermsMetrics {
      .label {
        font-size: 15px;
        font-weight: 400;
      }
      .value {
        font-size: 15px;
        font-weight: 400;
        color: black;
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
