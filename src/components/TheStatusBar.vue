<template>
  <div class="theStatusBar" @click="statusBarRedirection()">
    <v-avatar class="theStatusBar__avatar" size="23px" color="rgba(0, 0, 0, 0.4)">
      <!-- <img :src="require(`@/assets/images/avatar/${this.userData.avatarDefault}.svg`)"> -->
      <img :src="require(`@/assets/images/avatar/man.svg`)">
    </v-avatar>
    <span class="theStatusBar__text-status">Connected as Stéphane Changarnier</span>
    <div class="theStatusBar__btn-detail">...</div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  methods: {
    statusBarRedirection () {
      console.log('StatusBarRedirection')
      this.$router.push({ name: 'profile' })
    }
  }
}
</script>

<style lang="scss">
.theStatusBar {
  background: $color-golden-darker;
  background: green;
  color: $color-golden;
  height: 40px;
  width: 100%;
  position: fixed;
  padding-left: 25px;
  padding-top: 8px;
  &__avatar {
    margin-right: 10px;
    vertical-align: middle;
  }

  &__text-status {
    vertical-align: middle;
    position: relative;
    top: 1px;
  }

  &__btn-detail {
    position: absolute;
    top: 48%;
    transform: translateY(-50%);
    height: 10px;
    line-height: 0;
    letter-spacing: 3px;
    right: 25px;
    color: $color-golden;
    font-size: 24px;
  }
}
</style>
