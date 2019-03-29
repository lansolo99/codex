<template>
  <div class="theInstallAppBar">
    <v-layout>
      <v-flex shrink>
        <v-avatar class="theInstallAppBar__avatar primary mr-2" size="23px">
          <v-icon class="icon icon-download"></v-icon>
        </v-avatar>
      </v-flex>
      <v-flex>
        <span class="theInstallAppBar__text">Install the app</span>
      </v-flex>
      <v-flex shrink>
        <div class="theStatusBar__btn-detail">...</div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.theInstallAppBar {
  position: absolute;
  top: 0;
  left: 0;
  background: $color-matterhorn;
  color: $color-golden;
  height: 40px;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 8px;

  &__avatar {
    .v-icon {
      font-size: 16px;
    }
  }

  &__text {
    text-transform: uppercase;
    position: relative;
    top: 2px;
    display: block;
  }

  &__btn-detail {
    position: relative;
    top: 48%;
    transform: translateY(-50%);
    height: 10px;
    line-height: 0;
    letter-spacing: 3px;
    color: $color-golden;
    font-size: 24px;
  }
}
</style>
