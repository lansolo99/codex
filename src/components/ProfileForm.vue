<template>
  <!-- ProfileForm -->
  <v-container class="profileForm primary pa-0">
    <v-layout>
      <v-flex xs-12>
        <v-form
          ref="profileForm"
          lazy-validation
        >
          <!-- Account -->
          <div class="fieldset fieldset--account">
            <h6 class="subheader subheader--first my-3 black--text">{{profileDatas.pseudo}}</h6>
            <v-card class="secondary pa-3">
              <v-layout
                row
                wrap
              >
                <v-flex
                  xs-12
                  text-xs-center
                >
                  <v-avatar
                    size="110px"
                    color="rgba(0, 0, 0, 0.4)"
                  >
                    <img
                      v-if="profileDatas.avatarImage === ''"
                      :src="require(`@/assets/images/avatar/${this.profileDatas.avatarDefault}.svg`)"
                    >
                    <img
                      v-else
                      :src="profileDatas.avatarImage"
                    >

                    <image-uploader
                      ref="fileInput"
                      :debug="2"
                      :maxWidth="512"
                      :quality="0.7"
                      :autoRotate="true"
                      outputFormat="string"
                      :preview="false"
                      :className="['fileinput', { 'fileinput--loaded' : formComponents.hasImage }]"
                      doNotResize="['gif', 'svg']"
                      @input="setImage"
                      @onUpload="startImageResize"
                      @onComplete="endImageResize"
                    >
                      <label
                        for="fileInput"
                        slot="upload-label"
                      >
                        <figure>
                          <v-btn
                            fab
                            small
                            dark
                            right
                            class="colorGreen mr-0"
                            @click="handleChangeAvatar"
                          >
                            <v-icon class="icon icon-camera"></v-icon>
                          </v-btn>
                        </figure>
                      </label>
                    </image-uploader>
                    <v-btn
                      v-if="profileDatas.avatarImage !==''"
                      fab
                      small
                      dark
                      right
                      class="reset colorRed mr-0"
                      @click="handleResetAvatar"
                    >
                      <v-icon class="icon icon-trash"></v-icon>
                    </v-btn>
                  </v-avatar>
                </v-flex>
              </v-layout>
            </v-card>
            <v-card class="pt-3 pl-3 pr-3 pb-0">
              <v-text-field
                :disabled="!editing"
                color="secondary"
                label="Email"
                readonly
                v-model="profileDatas.email"
                required
              ></v-text-field>
              <v-text-field
                :disabled="!editing"
                color="secondary"
                label="Registration date"
                readonly
                :value="formatRegistrationDate"
                required
              ></v-text-field>
            </v-card>
          </div>
          <!-- Settings -->
          <div class="fieldset fieldset--settings pt-3">
            <h6 class="subheader subheader--first my-3 black--text">Settings</h6>
            <v-card>
              <v-container class="secondary ma-0 pb-2 white--text">
                <v-layout
                  row
                  wrap
                >
                  <v-flex shrink>
                    <div class="category">
                      <img
                        :src="require(`@/assets/images/icons_categories/Reminder.svg`)"
                        alt
                      >
                    </div>
                  </v-flex>
                  <v-flex
                    grow
                    class="pt-1 pl-3 pr-3 pb-1"
                  >
                    <span class="custom-title">Daily tasks reminder</span>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-container>
                <v-layout
                  row
                  wrap
                >
                  <v-flex xs8>
                    <v-switch
                      @change="manageSubscribe()"
                      v-model="profileDatas.notifications.dailyTaskReminder.status"
                      :label="profileDatas.notifications.dailyTaskReminder.status ? 'On':'Off'"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs4>
                    <v-select
                      v-if="profileDatas.notifications.dailyTaskReminder.status"
                      :items="formComponents.reminderHour"
                      label="Time"
                      v-model="profileDatas.notifications.dailyTaskReminder.time"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </div>
        </v-form>
      </v-flex>
    </v-layout>
    <!-- Notification permission denied -->
    <Dialog
      :vmodel="dialogNotificationPermissionDenied"
      title="Notifications denied!"
      color="red"
      :closeIcon="true"
      @closeDialog="dialogNotificationPermissionDenied = false"
    >
      <template v-slot:body>
        You chose to deny notification. You might want to manually toggle that choice in your browser settings if you change your mind.
      </template>
      <template v-slot:actions>
        <v-btn
          color="red darken-1"
          flat="flat"
          @click="dialogNotificationPermissionDenied = false"
        >Ok</v-btn>
      </template>
    </Dialog>
    <!-- Web push notifications not supported -->
    <Dialog
      :vmodel="dialogNotificationNotSupportedEnv"
      title="Notifications not supported!"
      color="red"
      :closeIcon="true"
      @closeDialog="resetNotificationSwitch()"
    >
      <template v-slot:body>
        <p>Sorry but push notifications are not supported with your device. Maybe some days...</p>
        <p>Try Android instead.</p>
      </template>
    </Dialog>
  </v-container>
</template>

<script>
import { EventBus } from '@/bus'
import { mapState, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import firebase from '@/Firebase'
import ImageUploader from 'vue-image-upload-resize'
import { format } from 'date-fns'
import Dialog from '@/components/Dialog'
import Vue from 'vue'
Vue.use(ImageUploader)

export default {
  components: {
    Dialog
  },
  comments: true,
  name: 'ProfileForm',
  data () {
    return {
      editing: false,
      dialogNotificationPermissionDenied: false,
      dialogNotificationNotSupportedEnv: false,
      formComponents: {
        reminderSwitch: false,
        reminderHour: [
          { text: '00:00', value: 0 },
          { text: '01:00', value: 1 },
          { text: '02:00', value: 2 },
          { text: '03:00', value: 3 },
          { text: '04:00', value: 4 },
          { text: '05:00', value: 5 },
          { text: '06:00', value: 6 },
          { text: '07:00', value: 7 },
          { text: '08:00', value: 8 },
          { text: '09:00', value: 9 },
          { text: '10:00', value: 10 },
          { text: '11:00', value: 11 },
          { text: '12:00', value: 12 },
          { text: '13:00', value: 13 },
          { text: '14:00', value: 14 },
          { text: '15:00', value: 15 },
          { text: '16:00', value: 16 },
          { text: '17:00', value: 17 },
          { text: '18:00', value: 18 },
          { text: '19:00', value: 19 },
          { text: '20:00', value: 20 },
          { text: '21:00', value: 21 },
          { text: '22:00', value: 22 },
          { text: '23:00', value: 23 }
        ],
        hasImage: false,
        passwordType: 'password',
        iconShowPassword: 'icon-eye',
        repeatPassword: '',
        gender: [
          'Undefined',
          'Male',
          'Female'
        ],
        maritalStatus: [
          'Undefined',
          'single',
          'married',
          'divorced',
          'widowed'
        ],
        countries: []
      },
      profileDatas: {}
    }
  },
  mixins: [validationMixin],
  validations: {
    formComponents: {
    },
    profileDatas: {
      pseudo: { required }
    }
  },
  computed: {
    ...mapState({
      profile: state => state.profile,
      utility: state => state.utility
    }),
    dailyTaskRemindertime: function () {
      return this.profileDatas.notifications.dailyTaskReminder.time
    },
    formatRegistrationDate () {
      return format(
        new Date(this.profileDatas.registrationDate), 'D MMMM YYYY')
    }
  },
  watch: {
    'profileDatas.notifications.dailyTaskReminder.time': function (newVal, oldVal) {
      this.notificationHour()
    }
  },
  methods: {
    ...mapActions({
      updateProfile: 'profile/updateProfile',
      toggleProfileDialog: 'utility/toggleProfileDialog'

    }),
    togglePasswordVisibility (field) {
      this.formComponents.passwordType === 'password' ? this.formComponents.passwordType = 'clear' : this.formComponents.passwordType = 'password'
      this.formComponents.iconShowPassword === 'icon-eye' ? this.formComponents.iconShowPassword = 'icon-eye_hidden' : this.formComponents.iconShowPassword = 'icon-eye'
    },
    handleEditProfile () {
      this.toggleProfileDialog(true)
    },
    saveProfile () {
      // Update profile store
      const profileDatas = JSON.parse(JSON.stringify(this.profileDatas))
      this.updateProfile(profileDatas).then(() => {
        // Update firebase
        EventBus.$emit('updateFirebase')
      })
    },
    handleChangeAvatar () {
      const isSafari = window.safari !== undefined
      const isIos = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
      if (isSafari || isIos) {
      } else {
        this.$refs.fileInput.$el.childNodes[1].click()
      }
    },
    handleResetAvatar () {
      this.profileDatas.avatarImage = ''
      this.formComponents.hasImage = false
      this.saveProfile()
    },
    manageSubscribe () {
      if (this.profileDatas.notifications.dailyTaskReminder.status) {
        // status just set to True -> try subscription
        this.subscribeNotification()
      } else {
        // status just set to False -> unsubscribe
        this.unsubscribeNotification()
      }
    },
    subscribeNotification () {
      console.log('subscribeToNotifications')
      if (firebase.messaging.isSupported()) {
        // Request permission
        const messaging = firebase.messaging()
        messaging.requestPermission().then(() => {
          console.log('Notification permission granted.')
          messaging.getToken().then(token => {
            console.log('token =' + token)
            this.profileDatas.notifications.token = token
            const profileDatas = JSON.parse(JSON.stringify(this.profileDatas))
            this.updateProfile(profileDatas).then(() => {
            // Update firebase
              EventBus.$emit('updateFirebase')
            })
          })
        }).catch(err => {
          console.log('Unable to get permission to notify.', err)
          this.dialogNotificationPermissionDenied = true
          this.profileDatas.notifications.dailyTaskReminder.status = false
        })
      } else {
        this.unsupportedNotifications()
      }
    },
    unsubscribeNotification (context) {
      console.log('unSubscribeFromNotifications')
      // SignOut context
      if (context === 'signOut' || context === 'signIn') { this.profileDatas.notifications.dailyTaskReminder.status = false }
      // User had token -> delete token
      if (!this.profileDatas.notifications.dailyTaskReminder.status && this.profileDatas.notifications.token !== '') {
        if (firebase.messaging.isSupported()) {
        // Retrieve Firebase Messaging object.
          const messaging = firebase.messaging()
          messaging.getToken()
            .then(token => {
              messaging.deleteToken(token)
            })
            .then(() => {
              this.profileDatas.notifications.token = ''
              const profileDatas = JSON.parse(JSON.stringify(this.profileDatas))
              this.updateProfile(profileDatas).then(() => {
              // Update firebase
                if (context === 'signOut') {
                  EventBus.$emit('updateFirebase', context)
                } else {
                  EventBus.$emit('updateFirebase')
                }
              })
            })
        } else {
          if (context === 'signOut') {
            EventBus.$emit('updateFirebase', context)
          } else {
            this.unsupportedNotifications()
            EventBus.$emit('updateFirebase')
          }
        }
      } else {
        // User had no token, no need to delete token
        this.profileDatas.notifications.dailyTaskReminder.status = false
      }
    },
    unsupportedNotifications () {
      // Web push not supported
      // this.profileDatas.notifications.dailyTaskReminder.status = false
      this.dialogNotificationNotSupportedEnv = true
      this.profileDatas.notifications.token = ''
      const profileDatas = JSON.parse(JSON.stringify(this.profileDatas))
      this.updateProfile(profileDatas).then(() => {
        // Update firebase
        EventBus.$emit('updateFirebase')
      })
    },
    resetNotificationSwitch () {
      this.dialogNotificationNotSupportedEnv = false
      this.profileDatas.notifications.dailyTaskReminder.status = false
    },
    notificationHour () {
      // Update profile store
      const profileDatas = JSON.parse(JSON.stringify(this.profileDatas))
      this.updateProfile(profileDatas).then(() => {
        // // Update firebase
        EventBus.$emit('updateFirebase')
      })
    },
    setImage: function (output) {
      console.log('setImage')
      this.formComponents.hasImage = true
      this.profileDatas.avatarImage = output
      this.formComponents.image = output
      console.log(output)
    },
    startImageResize () {
      EventBus.$emit('appSpinner', true)
    },
    endImageResize () {
      EventBus.$emit('appSpinner', false)
      this.saveProfile()
    }
  },
  created () {
    // Populate local datas
    const retrievedProfile = JSON.parse(JSON.stringify(this.$store.state.profile))
    this.profileDatas = retrievedProfile

    /* =============================================
                       EVENTS
    ============================================= */
    EventBus.$on('editProfile', (status) => {
      this.editing = status
    })

    EventBus.$on('updateProfileDatas', (status) => {
      const retrievedProfile = JSON.parse(JSON.stringify(this.$store.state.profile))
      this.profileDatas = retrievedProfile
    })

    EventBus.$on('unsubscribeNotification', (context) => {
      this.unsubscribeNotification(context)
    })
  }

}
</script>

<style lang="scss">
#fileInput {
  //display: none;
  position: absolute;
  width: 0px;
  height: 0px;
  overflow: hidden;
}
.profileForm {
  .custom-title {
    font-size: 16px;
  }
  h6.subheader {
    opacity: 0.7;
    margin-top: 35px !important;
    &--first {
      margin-top: 20px !important;
    }
  }
  .v-avatar {
    img {
      object-fit: cover;
    }
    .v-btn--right {
      position: absolute;
      right: -10px;
      bottom: -5px;
      &.reset {
        right: 80px;
      }
    }
  }
  .fieldset {
    &--settings {
      .category {
        img {
          display: block;
          width: 34px;
        }
      }
    }
    &--password {
      position: relative;
      .customIcon {
        width: 25px;
        height: 25px;
        position: absolute;
        right: 5px;
        top: 7px;
      }
    }
    &--informations {
      .v-slider__thumb-label {
        color: white;
        font-size: 14px;
      }
    }
  }
  input[disabled] {
    opacity: 0.55;
    -webkit-text-fill-color: black;
  }
  .theme--light.v-input input,
  .theme--light.v-input input[disabled],
  .theme--light.v-input--is-disabled .v-label,
  .theme--light.v-select .v-select__selection--disabled,
  .theme--light.v-select .v-select__selections {
    color: rgba(0, 0, 0, 0.55) !important;
  }
  .theme--light.v-text-field.v-input--is-disabled
    > .v-input__control
    > .v-input__slot:before {
    display: none;
  }
  .theme--light.v-text-field.v-input--is-disabled {
    .v-input__append-inner {
      display: none;
    }
  }
  .theme--light.v-input--is-disabled .v-label {
    opacity: 0.7;
  }
}
.standard-dialog {
  .close {
    position: absolute;
    top: 15px;
    right: 15px;
  }
}
</style>
