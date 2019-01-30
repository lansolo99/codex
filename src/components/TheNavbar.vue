<template>
  <!-- <div class="headline text-xs-center pa-5">Active: {{ bottomNav }}</div> -->
  <v-bottom-nav :active.sync="bottomNav" :value="true" color="primary" app fixed>
    <v-btn to="/" flat color="white" value="recent">
      <v-icon class="icon icon-check"></v-icon>
    </v-btn>

    <v-btn to="/stats" flat value="favorites">
      <v-icon class="icon icon-stats"></v-icon>
    </v-btn>

    <v-btn to="/stats" flat value="nearby">
      <v-icon class="icon icon-profile"></v-icon>
    </v-btn>
  </v-bottom-nav>
</template>

<script>
export default {
  data () {
    return {
      bottomNav: 'recent'
    }
  }
}
</script>

<style lang="scss">
// Overwrite Vuetify navbar position
.v-item-group.v-bottom-nav {
  border-top: 1px solid rgba(0, 0, 0, 0.2) !important;
  left: auto;
  max-width: 400px;
  margin: auto;
  left: auto;
  box-shadow: none;

  .v-btn {
    padding: 8px 12px 4px;
    &:not(:first-child) {
      &:before {
        content: "";
        width: 1px;
        height: 100%;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.65) 0%,
          rgba(0, 0, 0, 0.1) 100%
        );
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }

  .icon {
    &:before {
      font-size: 1.3em;
    }
  }
  &:before {
    content: "";
    position: absolute;
    top: -81px;
    left: 0;
    height: 80px;
    width: 100%;
    pointer-events: none;
    background-image: linear-gradient(
      -180deg,
      rgba(255, 186, 76, 0) 20%,
      #ffba4c 100%
    );
  }
}
</style>
