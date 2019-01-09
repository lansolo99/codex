<template>
  <v-container class="stats">
    <h1 class="ma-3">This is the stats page</h1>
    <v-layout row class="mb-3">
      <v-btn small flat class="grey" @click="sortBy('title')" :loading="true">
        <v-icon left small>folder</v-icon>
        <span class="caption text-lowercase">Sort by project name</span>
      </v-btn>
      <v-btn small flat class="grey" @click="sortBy('person')">
        <v-icon left small>person</v-icon>
        <span class="caption text-lowercase">Sort by project name</span>
      </v-btn>
    </v-layout>
    <v-layout row wrap>
      <v-flex
        v-for="project in projects"
        :key="project.name"
        xs12
        :class="`${project.status} blue pa-2`"
      >
        <div class="caption">{{project.name}}</div>
        <h1>{{project.person}}</h1>
        <v-divider class="mt-1"></v-divider>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar">
      <span>Welcome</span>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      projects: [
        { name: 'south africa', person: 'stephane', status: 'on' },
        { name: 'marseille', person: 'didier', status: 'off' }
      ],
      snackbar: true
    }
  },
  methods: {
    sortBy (arg) {
      console.log(arg)
      this.projects.sort(project => project.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.stats {
  h1 {
    display: block;
    //background-color: red;
  }
}
</style>
