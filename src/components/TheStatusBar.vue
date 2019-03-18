<template>
  <div :class="['theStatusBar', statusBarDisplayConf]" @click="statusBarRedirection()">
    <v-avatar class="theStatusBar__avatar" size="23px">
      <img
        v-if="profile.avatarImage === ''"
        :src="require(`@/assets/images/avatar/${this.profile.avatarDefault}.svg`)"
      >
      <img v-else :src="profile.avatarImage">
    </v-avatar>
    <span class="theStatusBar__text-status">
      Connected as
      <i>{{profile.pseudo}}</i>
    </span>
    <div class="theStatusBar__btn-detail">...</div>
    <v-dialog v-model="guestDialog" max-width="350" content-class="standard-dialog guest">
      <v-card>
        <v-card-title class="title red white--text pt-3 pb-3" primary-title>Guest mode!
          <v-icon
            right
            class="white--text icon icon-delete close"
            @click="handleGuestDialog ('continue')"
          ></v-icon>
        </v-card-title>
        <v-card-text>You are testing Weekx as a guest. Accordingly, there is not records tracking. Please sign-up or use a sign-in method to do so.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            flat="flat"
            @click="handleGuestDialog('backToLogin')"
          >Back to the login screen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { EventBus } from '@/bus'

export default {
  data () {
    return {
      statusBarDisplayConf: '',
      guestDialog: false
    }
  },
  computed: {
    ...mapState({
      profile: state => state.profile,
      utility: state => state.utility
    })
  },
  methods: {
    statusBarRedirection () {
      console.log('StatusBarRedirection')
      if (this.utility.authUserID !== 'guest') {
        // User
        this.$router.push({ name: 'profile' })
      } else {
        // Guest
        this.guestDialog = true
      }
    },
    handleGuestDialog (action) {
      if (action === 'continue') {
        this.guestDialog = false
      } else {
        EventBus.$emit('signOut')
        this.$router.push({ name: 'login' })
      }
    }
  },
  mounted () {
    if (this.$route.path === '/stats') {
      this.statusBarDisplayConf = 'fixedConf'
    } else {
      this.statusBarDisplayConf = 'absoluteConf'
    }

    // globalUpdate
    EventBus.$on('showGuestDialog', () => {
      this.guestDialog = true
    })
  }
}
</script>

<style lang="scss">
.theStatusBar {
  &.absoluteConf {
    position: absolute;
    top: 0;
    left: 0;
  }

  &.fixedConf {
    position: fixed;
    top: 0;
  }

  background: $color-golden-darker;
  color: $color-golden;
  height: 40px;
  width: 100%;
  padding-left: 20px;
  padding-top: 8px;
  &__avatar {
    margin-right: 10px;
    vertical-align: middle;
    background-color: rgba(black, 0.5);
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
    right: 20px;
    color: $color-golden;
    font-size: 24px;
  }
}

.standard-dialog {
  .v-card__title {
    font-weight: 600;
    line-height: 24px;
  }
  .v-card__text {
    font-size: 16px;
    font-weight: 400;
  }
  &.guest {
    .close {
      position: absolute;
      top: 15px;
      right: 15px;
    }
  }
}
</style>
