<template>
  <v-bottom-nav
    class="theNavbar"
    :active.sync="bottomNav"
    :value="true"
    color="primary"
    app
    fixed
  >
    <v-btn
      to="/tasks"
      flat
      color="white"
      value="tasks"
    >
      <v-icon class="icon icon-check"></v-icon>
    </v-btn>

    <v-btn
      to="/stats"
      color="white"
      flat
      value="stats"
    >
      <v-icon class="icon icon-stats"></v-icon>
    </v-btn>

    <v-btn
      v-if="utility.authUserID === 'guest'"
      color="white"
      flat
      value="profile"
      class="simulateDisabled"
      @click.native="profileLink()"
    >
      <v-icon class="icon icon-profile"></v-icon>
    </v-btn>

    <v-btn
      v-else
      :to="'/profile'"
      color="white"
      flat
      value="profile"
    >
      <v-icon class="icon icon-profile"></v-icon>
    </v-btn>
    <div class></div>
  </v-bottom-nav>
</template>

<script>
import { mapState } from 'vuex'
import { EventBus } from '@/bus'
export default {
  data () {
    return {
      bottomNav: ''
    }
  },
  computed: {
    ...mapState({
      utility: state => state.utility
    })
  },
  methods: {
    profileLink () {
      console.log('profileLink')
      EventBus.$emit('showGuestDialog')
    }
  }

}
</script>

<style lang="scss">
// Overwrite Vuetify navbar position

.v-item-group.v-bottom-nav {
  border-top: 1px solid rgba(0, 0, 0, 0.2) !important;
  margin: auto;
  left: auto;
  box-shadow: none;

  .v-btn {
    padding: 8px 12px 4px;
    max-width: none;

    &:not(:first-child) {
      &:before {
        content: "";
        width: 1px;
        height: 100%;
        background: linear-gradient(
          to bottom,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0.6) 100%
        );
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    &--active {
      background-color: #df9115 !important;
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
    // substract container's height
    top: calc(-35px + 1px);
    left: 0;
    height: 35px;
    width: 100%;
    pointer-events: none;
    background-image: linear-gradient(
      -180deg,
      rgba($color-golden, 0) 0%,
      rgba($color-golden, 0.5) 100%
    );
  }
}
.theNavbar {
  @include responsive(desktopscreens) {
    margin: auto;
    max-width: 375px;
  }
  .v-btn {
    &.simulateDisabled {
      opacity: 0.5 !important;
      background: none !important;
      color: rgba(0, 0, 0, 0.54) !important;
      &.v-btn--active {
        color: rgba(0, 0, 0, 0.54) !important;
      }
    }
  }
}
</style>
