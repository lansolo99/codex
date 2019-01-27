<template>
  <div class="mb-5">
    <v-container class="stats">
      <v-card>
        <v-sheet color="green" elevation="0">
          <v-sparkline
            :value="value"
            :stroke-linecap="'round'"
            :gradient="gradients[0]"
            :smooth="true"
            line-width="4"
            height="100"
            padding="30"
            auto-draw
          >
            <template slot="label" slot-scope="item">
              {{ item.value
              }}
            </template>
          </v-sparkline>
        </v-sheet>
      </v-card>
      <v-card>
        <v-sparkline
          :labels="labels"
          :value="value"
          :stroke-linecap="'round'"
          :gradient="gradients[0]"
          :smooth="true"
          line-width="4"
          height="100"
          padding="30"
          auto-draw
        ></v-sparkline>

        <div class="example">
          <apexcharts
            width="100%"
            height="300"
            type="heatmap"
            :options="chartOptions"
            :series="series"
          ></apexcharts>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import Vue from 'vue'
Vue.use(VueApexCharts)

export default {
  components: {
    apexcharts: VueApexCharts
  },
  data () {
    return {

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
          enabled: false
        },
        colors: ['#F44336'],
        tooltip: {
          enabled: false
        },
        xaxis: {
          type: 'category',
          position: 'bottom',
          categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          offsetY: '-250',
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
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
        // data: this.generateData(7, {
        //   min: 0,
        //   max: 90
        // })
      }
      ],

      gradients: [
        ['red', 'orange', 'yellow']
      ],
      labels: [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun'
      ],
      value: [
        100,
        100,
        100,
        100,
        100,
        90,
        100
      ]
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
</style>
