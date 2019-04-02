<template>
  <!-- ProfileForm -->
  <v-container class="profileForm primary pa-0">
    <v-layout>
      <v-flex xs-12>
        <v-form ref="profileForm" lazy-validation>
          <!-- Account -->
          <div class="fieldset fieldset--account">
            <h6 class="subheader subheader--first my-3 black--text">{{profileDatas.pseudo}}</h6>
            <v-card class="secondary pa-3">
              <v-layout row wrap>
                <v-flex xs-12 text-xs-center>
                  <v-avatar size="110px" color="rgba(0, 0, 0, 0.4)">
                    <img
                      v-if="profileDatas.avatarImage === ''"
                      :src="require(`@/assets/images/avatar/${this.profileDatas.avatarDefault}.svg`)"
                    >
                    <img v-else :src="profileDatas.avatarImage">
                    <v-btn fab small dark right class="colorGreen mr-0" @click="handleChangeAvatar">
                      <v-icon class="icon icon-camera"></v-icon>
                    </v-btn>
                    <!-- Avatar input type file -->
                    <input
                      type="file"
                      style="display: none"
                      ref="fileInput"
                      accept="image/*"
                      @change="onFilePicked"
                    >
                    <!-- End of Avatar input type file -->
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
            </v-card>
          </div>
          <!-- Settings -->
          <div class="fieldset fieldset--settings pt-3">
            <h6 class="subheader subheader--first my-3 black--text">Settings</h6>
            <v-card>
              <v-container class="secondary ma-0 pb-2 white--text">
                <v-layout row wrap>
                  <v-flex shrink>
                    <div class="category">
                      <img :src="require(`@/assets/images/icons_categories/Reminder.svg`)" alt>
                    </div>
                  </v-flex>
                  <v-flex grow class="pt-1 pl-3 pr-3 pb-1">
                    <span class="custom-title">Daily tasks reminders</span>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs5>
                    <v-switch
                      @click.native="manageSubscribe()"
                      v-model="profileDatas.notifications.dailyTaskReminder.status"
                      :label="profileDatas.notifications.dailyTaskReminder.status ? 'On':'Off'"
                    ></v-switch>
                  </v-flex>
                  <v-flex xs7>
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
    <v-dialog
      v-model="dialogAvatarChangeNeedNetwork"
      persistent
      max-width="350"
      content-class="standard-dialog"
    >
      <v-card>
        <v-card-title class="title red white--text pt-3 pb-3" primary-title>A problem occured!</v-card-title>

        <v-card-text>You can't make change to your avatar while offline, try again later.</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" flat="flat" @click="dialogAvatarChangeNeedNetwork = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogNotificationPermissionDenied"
      max-width="350"
      content-class="standard-dialog"
    >
      <v-card>
        <v-card-title class="title red white--text pt-3 pb-3" primary-title>
          Notifications denied
          <v-icon
            right
            class="white--text icon icon-delete close"
            @click="dialogNotificationPermissionDenied = false"
          ></v-icon>
        </v-card-title>

        <v-card-text>You chose to deny notification. You might want to manually toggle that choice in your browser settings if you change your mind.</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            flat="flat"
            @click="dialogNotificationPermissionDenied = false"
          >Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { EventBus } from '@/bus'
import { mapState, mapGetters, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import firebase from '@/Firebase'

export default {
  comments: true,
  name: 'ProfileForm',
  data () {
    return {
      editing: false,
      dialogAvatarChangeNeedNetwork: false,
      dialogNotificationPermissionDenied: false,
      formComponents: {
        reminderSwitch: false,
        reminderHour: [
          '00:00',
          '00:01',
          '00:02',
          '00:03',
          '00:04',
          '00:05',
          '00:06',
          '00:07',
          '00:08',
          '00:09',
          '00:10',
          '00:11',
          '00:12',
          '00:13',
          '00:14',
          '00:15',
          '00:16',
          '00:17',
          '00:18',
          '00:19',
          '00:20',
          '00:21',
          '00:22',
          '00:23'
        ],
        avatarImageRaw: null,
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
    ...mapGetters({
      getCountries: 'utility/getCountries'
    })

  },
  methods: {
    ...mapActions({
      updateProfile: 'profile/updateProfile',
      addUserToken: 'profile/addUserToken',
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
      // Upload/update new avatar image
      const avatarImageRaw = this.formComponents.avatarImageRaw

      if (avatarImageRaw) {
        if (this.isOnline) {
          firebase.storage().ref('users').child(this.utility.authUserID)
            .put(avatarImageRaw)
            .then(url => {
              firebase.storage().ref('users').child(this.utility.authUserID).getDownloadURL()
                .then(url => {
                // Update profile store
                  this.profileDatas.avatarImage = url
                  const profileDatas = JSON.parse(JSON.stringify(this.profileDatas))

                  this.updateProfile(profileDatas).then(() => {
                  // Update firebase
                    EventBus.$emit('updateFirebase')
                  })
                }).catch(res => {
                  console.log(res.message)
                  this.dialogAvatarChangeNeedNetwork = true
                })
            })
            .catch(res => {
              // Need online to change image
              console.log(res.message)
              this.dialogAvatarChangeNeedNetwork = true
            })
        } else {
        // Update profile store
          const profileDatas = JSON.parse(JSON.stringify(this.profileDatas))

          this.updateProfile(profileDatas).then(() => {
            // Update firebase
            EventBus.$emit('updateFirebase')
          })
        }
      } else {
        // Update profile store
        const profileDatas = JSON.parse(JSON.stringify(this.profileDatas))

        this.updateProfile(profileDatas).then(() => {
          // Update firebase
          EventBus.$emit('updateFirebase')
        })
      }
    },
    handleChangeAvatar () {
      if (this.isOnline) {
        this.$refs.fileInput.click()
        console.log('handleChangeAvatar')
      } else {
        this.dialogAvatarChangeNeedNetwork = true
      }
    },
    handleResetAvatar () {
      console.log('handleResetAvatar')
      this.profileDatas.avatarImage = ''
      this.formComponents.avatarImageRaw = null
      if (this.isOnline) {
        // Delete image file if it exists
        firebase.storage().ref('users').child(this.utility.authUserID).getDownloadURL()
          .then(res => {
            console.log(res)
            firebase.storage().ref('users').child(this.utility.authUserID)
              .delete()
              .then(() => {
                this.saveProfile()
              }).catch(error => {
                console.log(error)
                this.saveProfile()
              })
          }).catch(error => {
            console.log(error)
            this.saveProfile()
          })
      } else {
        this.dialogAvatarChangeNeedNetwork = true
      }
    },
    onFilePicked (event) {
      const files = event.target.files
      let filename = files[0].name
      // Prevent dots in filename
      if (filename.indexOf('.') <= 0) {
        return alert('Please add a valid file!')
      }
      // Convert file to base 64 string
      const fileReader = new FileReader()
      fileReader.readAsDataURL(files[0])
      fileReader.addEventListener('load', () => {
        // Populate local data with Base 64 string
        this.profileDatas.avatarImage = fileReader.result
        // Temporary store raw image file
        this.formComponents.avatarImageRaw = files[0]
        // Save profile
        this.saveProfile()
      })
    },
    manageSubscribe () {
      // Subscription Logic
      console.log('manageSubscribe')
      // status True
      if (this.profileDatas.notifications.dailyTaskReminder.status) {
        // Request permission
        console.log('subscribeToNotifications')
        // Retrieve Firebase Messaging object.
        const messaging = firebase.messaging()
        messaging.requestPermission().then(() => {
          console.log('Notification permission granted.')
          messaging.getToken().then(token => {
            console.log('token =' + token)
            this.profileDatas.token = token
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
        // status False
        console.log('go false')
        // If user had token
        if (!this.profileDatas.notifications.dailyTaskReminder.status && this.profileDatas.token !== '') {
          console.log('unSubscribeFromNotifications')
          // Retrieve Firebase Messaging object.
          const messaging = firebase.messaging()
          messaging.getToken()
            .then(token => {
              messaging.deleteToken(token)
            })
            .then(() => {
              this.profileDatas.token = ''
              const profileDatas = JSON.parse(JSON.stringify(this.profileDatas))
              this.updateProfile(profileDatas).then(() => {
              // Update firebase
                EventBus.$emit('updateFirebase')
              })
            })
        }
      }
      console.log(this.profileDatas.notifications.dailyTaskReminder.status)
    }
  },
  created () {
    // Reset local datas
    this.avatarImageRaw = null

    // Popupate getCountries
    this.formComponents.countries = this.getCountries
    // Populate local datas
    const retrievedProfile = JSON.parse(JSON.stringify(this.$store.state.profile))
    this.profileDatas = retrievedProfile

    EventBus.$on('editProfile', (status) => {
      this.editing = status
    })

    EventBus.$on('updateProfileDatas', (status) => {
      const retrievedProfile = JSON.parse(JSON.stringify(this.$store.state.profile))
      this.profileDatas = retrievedProfile
    })
  }

}
</script>

<style lang="scss">
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
</style>
