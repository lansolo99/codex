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
                  <v-card-text>Your global level is your average weekly score based on your last 10 weeks scores. It can go up and down, it depends entirely to your discipline commitment throughout this time.</v-card-text>
                </v-card>
              </v-dialog>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex grow>
              <v-progress-linear v-model="setProfileLevel" height="15" class="mt-2" width="80%"></v-progress-linear>
            </v-flex>
          </v-layout>
        </v-container>
        <!-- Last 10 weeks -->
        <v-container>
          <span class="label">Passed weeks completions (%)</span>
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

      <!-- Tasks distribution charts -->
      <div v-if="Object.keys(tasks).length" class="tasks_charts">
        <h6 class="subheader my-3 mt-4 black--text">Tasks completions</h6>
        <v-expansion-panel>
          <v-expansion-panel-content
            v-for="(task,key) in tasks"
            :key="key"
            class="secondary white--text"
          >
            <!-- Bar part -->
            <div slot="header" class="pb-1">
              <v-layout row wrap :class="`task ${task.status} mr-2 px-0`">
                <v-flex shrink>
                  <div :class="`category ${task.category}`">
                    <img
                      :src="require(`@/assets/images/icons_categories/${task.category}.svg`)"
                      alt
                    >
                  </div>
                </v-flex>

                <v-flex grow class="pt-1 pl-3 pr-3 pb-1 body-1">
                  <span class="custom-title">{{task.title}}</span>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex shrink width="0"></v-flex>
              </v-layout>
              <v-layout class="progressbarContainer">
                <v-flex grow>
                  <v-progress-linear
                    :value="calcHeatMapProgress(getHeatMapMetrics(task.completionsHistory, 1),getHeatMapMetrics(task.completionsHistory, 0),)"
                    height="15"
                    class="mt-2 mb-0"
                    width="80%"
                  ></v-progress-linear>
                </v-flex>
                <v-flex
                  class="progressbarContainer__value white--text text-xs-left pt-1 pl-2 pr-2 pb-0"
                  shrink
                >{{getHeatMapMetrics(task.completionsHistory, 1)}} / {{getHeatMapMetrics(task.completionsHistory,0)}} times</v-flex>
              </v-layout>
            </div>
            <!-- Expanded part -->
            <v-card class="details">
              <v-container>
                <span class="label">Completions history</span>
                <div
                  class="heatmap"
                  :style="{height: heatmapWrapperHeight(task.completionsHistory) + 'px' }"
                >
                  <div class="dailyCompletionsWrapper">
                    <apexcharts
                      type="heatmap"
                      width="100%"
                      :height="heatmapHeight(task.completionsHistory)"
                      :series="generateHeatMap(task.completionsHistory)"
                      :options="dailyCompletion.chartOptions"
                    ></apexcharts>
                  </div>
                </div>
              </v-container>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </v-container>
  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import VueApexCharts from 'vue-apexcharts'
import Vue from 'vue'
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
        trends: {
          gradients: [
            ['#56E39F', '#FFBA4C']
          ]
        }
      },
      dailyCompletion: {
        chartOptions: {
          chart: {
            toolbar: {
              show: false
            },
            animations: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
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
                  to: 0,
                  color: '#EA6060'
                },
                {
                  from: 1,
                  to: 1,
                  color: '#56E39F'
                },
                {
                  from: 2,
                  to: 2,
                  color: '#FFFFFF'
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
              show: false
            },
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
        }
      }
    }
  },
  computed: {
    ...mapState({
      storeDialogTask: state => state.utility.dialogTask,
      storeCurrentTask: state => state.utility.currentTask.id,
      tasks: state => state.tasks,
      time: state => state.time
    }),
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
  },
  methods: {
    calcHeatMapProgress (done, missed) {
      const coeff = missed / 100
      const total = done / coeff
      return total
    },
    getHeatMapMetrics (completionsHistory, status) {
      let metric = 0

      Object.values(completionsHistory).forEach(value => {
        value.forEach(v => {
          if (status === 1 && v === status) {
            metric += 1
          }
          if (status === 0 && (v === 0 || v === 1)) {
            metric += 1
          }
        })
      })

      return metric
    },
    heatmapWrapperHeight (completionsHistory) {
      const weeksNumber = Object.values(completionsHistory).length
      let totalHeight = (weeksNumber * 30) + 60
      totalHeight -= 40
      return totalHeight
    },
    heatmapHeight (completionsHistory) {
      const weeksNumber = Object.values(completionsHistory).length
      let totalHeight = (weeksNumber * 30) + 60
      return totalHeight
    },
    generateHeatMap (completionsHistory) {
      let series = []

      for (let [key, value] of Object.entries(completionsHistory)) {
        // Retrieved week slot
        const weekSlot = {
          name: key,
          data: value
        }
        series.push(weekSlot)
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
  .tasks_charts {
    .task {
      .custom-title {
        font-size: 16px;
        position: relative;
      }
      // Progressbar
    }
    .progressbarContainer {
      &__value {
        min-width: 126px;
      }
      .v-progress-linear__bar__determinate {
        @include progress-linear-fill;
      }
      .v-progress-linear__background {
        @include progress-linear-background;
        background-color: $color-red !important;
        box-shadow: inset 0px 0px 2px 1px rgba(0, 0, 0, 0.2);
      }
    }

    .details {
      h6 {
        font-size: 15px !important;
        font-weight: 600;
        color: rgba(black, 0.6);
      }
      p {
        font-weight: 300;
        font-size: 14px;
      }
    }
    //Expansions

    .v-expansion-panel__header {
      padding: 12px 12px;
      align-items: flex-start !important;
      &__icon {
        position: relative;
        top: 5px;
        opacity: 0.7;
        color: white !important;
        .v-icon {
          color: white !important;
        }
      }
    }

    .v-expansion-panel__container {
      &.secondary {
        &:not(:first-child) {
          border-top: 1px solid rgba(white, 0.2) !important;
        }
      }
    }

    // Categories
    .category {
      width: 34px;
      height: 100%;
      color: white;
      text-align: center;

      img {
        display: block;
        width: 34px;
        position: relative;
        top: -1px;
      }
    }
    // Apexchart
    .heatmap {
      //overflow: hidden;
    }
    .dailyCompletionsWrapper {
      margin-top: 10px;
      //overflow: hidden;

      .apexcharts-canvas {
        position: relative;
        top: -30px;
        left: -10px;
        pointer-events: none;
      }
      .apexcharts-xaxis-label {
        color: black;
        opacity: 0.6;
      }
      .apexcharts-yaxis {
        transform: translate(19px, 3px) !important;
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
