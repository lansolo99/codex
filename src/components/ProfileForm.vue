<template>
  <!-- ProfileForm -->
  <v-container class="profileForm primary pa-0">
    <v-layout>
      <v-flex xs-12>
        <v-form ref="profileForm" lazy-validation>
          <!-- Account -->
          <div class="fieldset fieldset--account">
            <h6 class="subheader subheader--first my-3 black--text">Account</h6>
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
                    <input
                      type="file"
                      style="display: none"
                      ref="fileInput"
                      accept="image/*"
                      @change="onFilePicked"
                    >
                    <v-btn
                      fab
                      small
                      dark
                      right
                      class="reset colorRed mr-0"
                      @click="handleResetAvatar"
                    >
                      <v-icon class="icon icon-reset"></v-icon>
                    </v-btn>
                  </v-avatar>
                </v-flex>
              </v-layout>
            </v-card>
            <v-card class="pt-3 pl-3 pr-3 pb-0">
              <v-text-field
                :disabled="!editing"
                color="secondary"
                class="red--text"
                label="Pseudo"
                readonly
                v-model="profileDatas.pseudo"
                required
              ></v-text-field>
              <v-text-field
                class="pt-1"
                :disabled="!editing"
                color="secondary"
                label="Email"
                readonly
                v-model="profileDatas.email"
                required
              ></v-text-field>
            </v-card>
          </div>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { EventBus } from '@/bus'
import { mapState, mapGetters, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import firebase from 'firebase'

export default {
  comments: true,
  name: 'ProfileForm',
  data () {
    return {
      editing: false,
      formComponents: {
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
              })
          })
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
      this.$refs.fileInput.click()
      console.log('handleChangeAvatar')
    },
    handleResetAvatar () {
      console.log('handleResetAvatar')
      this.profileDatas.avatarImage = ''
      this.formComponents.avatarImageRaw = null
      // Delete image file if it exists
      firebase.storage().ref('users').child(this.utility.authUserID).getDownloadURL()
        .then(res => {
          console.log(res)
          firebase.storage().ref('users').child(this.utility.authUserID)
            .delete()
            .then(() => {
              this.saveProfile()
            })
        }).catch(res => {
          console.log(res.message)
        })
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
  }

}
</script>

<style lang="scss">
.profileForm {
  h6.subheader {
    opacity: 0.7;
    margin-top: 35px !important;
    &--first {
      margin-top: 20px !important;
    }
  }
  .v-avatar {
    .v-btn--right {
      position: absolute;
      right: -18px;
      bottom: 36px;
      &.reset {
        bottom: -5px;
      }
    }
  }
  .fieldset {
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
