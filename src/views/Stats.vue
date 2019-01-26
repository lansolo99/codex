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
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({

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
  })
}
</script>

<style lang="scss">
</style>
