<template>
  <v-dialog
    id="profileDialog"
    content-class="profileEditor"
    transition="slide-y-transition"
    scrollable
    fullscreen
    v-model="dialogProfile"
  >
    <v-card flat tile>
      <!-- Toolbar -->
      <v-toolbar dark class="secondary dialogToolbar">
        <v-btn depressed flat @click="handleCancel">cancel</v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title class="primary--text font-weight-bold">Edit profile</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn depressed flat @click="handleSave">Save</v-btn>
      </v-toolbar>
      <v-card-text class="pa-0">
        <v-container class="dialogContainer primary pa-0">
          <v-container class="primary">
            <!-- Form -->
            <ProfileForm/>
          </v-container>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from '@/bus'
import { mapActions, mapState } from 'vuex'
import ProfileForm from '@/components/ProfileForm'
import * as easings from 'vuetify/es5/util/easing-patterns'

export default {
  components: {
    ProfileForm
  },
  data () {
    return {
      easings: Object.keys(easings),
      dialogProfile: false
    }
  },
  computed: {
    ...mapState({
      storeProfileTask: state => state.utility.dialogProfile
    }
    )
  },
  watch: {
    storeProfileTask () {
      this.dialogProfile = this.storeProfileTask
    }
  },
  methods: {
    ...mapActions({
      toggleProfileDialog: 'utility/toggleProfileDialog'
    }),
    handleSave () {
      EventBus.$emit('saveProfile')
    },
    handleCancel () {
      EventBus.$emit('editProfile', false)
      this.toggleProfileDialog(false)
    }
  }
}
</script>

<style lang="scss">
.profileEditor {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  max-width: 400px;
  margin: auto;
  left: auto;

  h6 {
    &:not(.white--text) {
      opacity: 0.7;
    }
  }
  .v-toolbar {
    .v-toolbar__title {
      font-size: 23px !important;
    }
    .v-toolbar__title:not(:first-child) {
      margin: 0;
    }
    .v-btn {
      opacity: 0.7;
    }
  }
  // Button group
  .theme--light.v-btn-toggle {
    width: 100%;
    height: 40px;
    align-items: center;

    .v-btn {
      &--active {
        color: white;
        background-color: $color-green;
      }
      &--active:before,
      &:focus:before,
      &:hover:before {
        background-color: white;
      }
      flex-grow: 1;
      height: 100%;
    }
  }
  .dialogContainer {
    height: 100%;
  }
}
</style>
