<template>
  <div
    :class="['theStatusBar', statusBarDisplayConf]"
    @click="statusBarRedirection()"
  >
    <v-layout>
      <v-flex shrink>
        <v-avatar
          class="theStatusBar__avatar"
          size="23px"
        >
          <img
            v-if="profile.avatarImage === ''"
            :src="
              require(`@/assets/images/avatar/${
                this.profile.avatarDefault
              }.svg`)
            "
          />
          <img
            v-else
            :src="profile.avatarImage"
          />
        </v-avatar>
      </v-flex>
      <v-flex class="theStatusBar__text-status-wrapper">
        <span class="theStatusBar__text-status">
          Connected as
          <i>{{ profile.pseudo }}</i>
        </span>
      </v-flex>
      <v-flex shrink>
        <div class="theStatusBar__btn-detail">...</div>
      </v-flex>
    </v-layout>
    <!-- Dialog Guest -->
    <!-- <Dialog
      :vmodel="dialogGuest"
      title="Test mode!"
      :closeIcon="true"
      color="red"
      @closeDialog="dialogGuest = false"
    >
      <template v-slot:body>
        <p>
          You are testing Weekx as a guest. Therefore, there is not records
          tracking.
        </p>
        <p class="mb-0">Please log in or register from the launch screen.</p>
      </template>
      <template v-slot:actions>
        <v-btn
          color="red darken-1"
          flat="flat"
          @click="handleGuestDialog('backToLogin')"
        >Back to the launch screen</v-btn>
      </template>
    </Dialog> -->
    <v-dialog
      v-model="dialogGuest"
      persistent
      max-width="350"
      content-class="standard-dialog"
    >
      <v-card>
        <!-- Title -->
        <v-card-title :class="['title white--text', 'red']">
          <div class="mr-4">Test mode!</div>

          <v-icon
            right
            class="white--text icon icon-delete close"
            @click="dialogGuest= false"
          ></v-icon>
        </v-card-title>
        <!-- Body -->
        <v-card-text>
          <p>
            You are testing Weekx as a guest. Therefore, there is not records
            tracking.
          </p>
          <p class="mb-0">Please log in or register from the launch screen.</p>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            flat="flat"
            @click="handleGuestDialog('backToLogin')"
          >Back to the launch screen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { EventBus } from '@/bus'
// import Dialog from '@/components/Dialog'

export default {
  components: {
    // Dialog
  },
  data () {
    return {
      statusBarDisplayConf: '',
      dialogGuest: false
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
        console.log('guest')
        this.dialogGuest = true
      }
    },
    handleGuestDialog (action) {
      console.log('handleGuestDialog')

      if (action === 'continue') {
        this.dialogGuest = false
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
      this.dialogGuest = true
    })
  }
}
</script>

<style lang="scss">
.theStatusBar {
  @include responsive(desktopscreens) {
    margin: auto;
    max-width: 375px;
  }

  &.absoluteConf {
    position: absolute;
    top: 0;
    left: 0;
  }

  &.fixedConf {
    position: fixed;
    top: 0;
    z-index: 200;
  }

  background: $color-matterhorn;
  color: $color-golden;
  height: 40px;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 8px;
  &__avatar {
    margin-right: 10px;
    background-color: rgba(black, 0.5);
    img {
      object-fit: cover;
      //
    }
  }
  &__text-status-wrapper {
    height: 23px;
    overflow: hidden;
    padding-right: 25px;
  }
  &__text-status {
    text-overflow: ellipsis;
    position: relative;
    top: 2px;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  &__btn-detail {
    // position: absolute;
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
