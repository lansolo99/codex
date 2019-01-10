<template>
  <div>
    <TheNavbar/>
    <v-container fluid>
      <v-expansion-panel>
        <v-expansion-panel-content v-for="task in tasks" :key="task.id">
          <v-layout slot="header" row wrap :class="`task ${task.status}`">
            <v-flex xs1 class="green">x</v-flex>
            <v-flex xs1 class="red">x</v-flex>
            <v-flex xs9 class="purple">{{task.title}}</v-flex>
            <v-flex xs1 class="green">x</v-flex>
          </v-layout>
          <v-card>
            <v-card-text>
              <ul>
                <li>{{task.description}}</li>
                <li>{{task.category}}</li>
              </ul>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TheNavbar
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapState([
      'tasks'
    ]),
    ...mapGetters([
      'allTasks'
    ])

  },
  methods: {
    ...mapActions([
      'addNewTask'
    ])
  }
}
</script>

<style>
.test {
  background-color: grey;
}
</style>
