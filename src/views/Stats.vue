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
              <span class="profileScore white--text">12/100</span>
            </v-flex>
            <v-flex shrink align-self-center>
              <v-btn fab small class="primary help mr-0">
                <v-icon class="icon icon-question_mark white--text"></v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex groww>
              <v-progress-linear
                v-model="levels.progressLevel"
                height="15"
                class="mt-2"
                width="80%"
              ></v-progress-linear>
            </v-flex>
          </v-layout>
        </v-container>
        <!-- This week -->
        <v-container>
          <span class="label">This week trend (%)</span>
          <v-sheet color="mb-3" elevation="0">
            <v-sparkline
              class="sparkline"
              :value="levels.trends.thisWeek.value"
              :labels="levels.trends.thisWeek.labels"
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
            :value="levels.trends.thisWeek.value"
            padding="16"
            height="10"
          >
            <template slot="label" slot-scope="item">{{ item.value }}</template>
          </v-sparkline>
        </v-container>
        <v-divider></v-divider>
        <!-- Last 10 weeks -->
        <v-container>
          <span class="label">Last 10 weeks trend (%)</span>
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
      <h6 class="subheader my-3 mt-4 black--text">Daily completions</h6>
      <v-card>
        <v-container class="pa-3">
          <span class="label">Last 10 weeks details</span>
          <div class="dailyCompletionsWrapper">
            <apexcharts
              width="100%"
              height="400"
              type="heatmap"
              :options="dailyCompletion.chartOptions"
              :series="dailyCompletion.series"
            ></apexcharts>
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

import { mapState, mapGetters } from 'vuex'
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
      levels: {
        progressLevel: 50,
        trends: {
          gradients: [
            ['#56E39F', '#FFBA4C']
          ],
          thisWeek: {
            labels: [
              'M',
              'T',
              'W',
              'T',
              'F',
              'S',
              'S'
            ],
            value: [
              20,
              100,
              80,
              100,
              100,
              30,
              100
            ]
          },
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
      dailyCompletion: {
        chartOptions: {
          chart: {
            toolbar: {
              show: false
            },
            animations: {
              enabled: false,
              easing: 'easeinout',
              speed: 800,
              animateGradually: {
                enabled: false,
                delay: 150
              },
              dynamicAnimation: {
                enabled: false,
                speed: 350
              }
            }
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '14px',
              fontFamily: 'Signika, sans-serif',
              colors: ['#ffffff']
            }
          },
          colors: ['#09DE77'],
          tooltip: {
            enabled: false
          },
          legend: {
            show: false
          },
          plotOptions: {
            heatmap: {
              radius: 2,
              enableShades: false,
              colorScale: {
                ranges: [{
                  from: 0,
                  to: 33,
                  color: '#EA6060'
                },
                {
                  from: 34,
                  to: 66,
                  color: '#FFBA4C'
                },
                {
                  from: 67,
                  to: 100,
                  color: '#56E39F'
                }
                ]
              }
            }
          },
          grid: {
            padding: {
              top: 0,
              right: 10,
              bottom: 0,
              left: 0
            }
          },
          xaxis: {
            type: 'category',
            position: 'bottom',
            categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            labels: {
              style: {
                fontSize: '13px',
                fontFamily: 'Signika, sans-serif',
                cssClass: 'apexcharts-xaxis-label'
              }
            },
            offsetY: '-355',
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '13px',
                fontFamily: 'Signika, sans-serif',
                cssClass: 'apexcharts-xaxis-label',
                padding: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0
                }
              }
            }
          },
          title: {
            text: ''
          }
        },
        series: [{
          name: 'W10',
          data: this.generateData(7, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'W9',
          data: this.generateData(7, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'W8',
          data: this.generateData(7, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'W7',
          data: this.generateData(7, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'W6',
          data: this.generateData(7, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'W5',
          data: this.generateData(7, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'W4',
          data: this.generateData(7, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'W3',
          data: this.generateData(7, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'W2',
          data: this.generateData(7, {
            min: 0,
            max: 90
          })
        },
        {
          name: 'W1',
          data: [{
            x: 'W1',
            y: 22
          }, {
            x: 'W2',
            y: 29
          }, {
            x: 'W3',
            y: 13
          }, {
            x: 'W4',
            y: 32
          },
          {
            x: 'W4',
            y: 32
          },
          {
            x: 'W4',
            y: 50
          },
          {
            x: 'W4',
            y: 100
          }
          ]
        }
        ]
      }
    }
  },
  computed: {
    ...mapState('time', ['now']),
    ...mapGetters('time', {
      today: 'today'
    })
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
      margin-top: 20px;
      overflow: hidden;
      height: 363px;
      .apexcharts-canvas {
        position: relative;
        top: -20px;
        margin-top: 5px;
        pointer-events: none;
      }
      .apexcharts-xaxis-label {
        color: black;
        opacity: 0.6;
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
</style>
