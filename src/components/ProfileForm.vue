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
                  <v-avatar size="80px" color="rgba(0, 0, 0, 0.4)">
                    <img v-if="userData.avatarImage" src alt="Avatar">
                    <img
                      v-else
                      :src="require(`@/assets/images/avatar/${this.userData.avatarDefault}.svg`)"
                    >
                  </v-avatar>
                </v-flex>
              </v-layout>
            </v-card>
            <v-card class="pa-3">
              <v-text-field
                :disabled="!editing"
                color="secondary"
                class="red--text"
                label="Pseudo"
                v-model="userData.pseudo"
                required
                :error-messages="pseudoErrors"
                @input="$v.userData.pseudo.$touch()"
                @blur="$v.userData.pseudo.$touch()"
              ></v-text-field>
              <v-text-field
                class="pt-1"
                :disabled="!editing"
                color="secondary"
                label="Email"
                v-model="userData.email"
                required
              ></v-text-field>
              <div v-if="editing" class="fieldset fieldset--password">
                <v-text-field
                  :type="formComponents.passwordType"
                  class="pt-1"
                  color="secondary"
                  label="Password"
                  v-model.trim="userData.password"
                ></v-text-field>
                <v-icon
                  @click="togglePasswordVisibility('password')"
                  :class="['icon', formComponents.iconShowPassword, 'customIcon']"
                ></v-icon>
              </div>
              <v-layout>
                <div class="updateAccountCatchError">{{updateAccountCatchError}}</div>
              </v-layout>
            </v-card>
          </div>

          <div class="fieldset fieldset--informations">
            <h6 class="subheader subheader--first my-3 black--text">Informations</h6>
            <v-card class="pt-4 pl-3 pr-3 pb-0">
              <v-select
                :disabled="!editing"
                class="pt-1"
                color="secondary"
                :items="formComponents.gender"
                label="Gender"
                v-model="userData.gender"
              ></v-select>
              <v-select
                class="pt-1"
                :disabled="!editing"
                color="secondary"
                :items="formComponents.maritalStatus"
                label="Marital status"
                v-model="userData.maritalStatus"
              ></v-select>
              <v-slider
                :readonly="!editing"
                class="pt-3 px-1"
                label="Age"
                :value="userData.age"
                v-model="userData.age"
                thumb-color="colorGreen"
                thumb-size="35"
                thumb-label="always"
                color="colorGreen"
                min="10"
                max="122"
              ></v-slider>
              <v-text-field
                :disabled="!editing"
                class="pt-1"
                color="secondary"
                label="City"
                v-model.trim="userData.city"
              ></v-text-field>
              <v-select
                class="pt-1"
                :disabled="!editing"
                color="secondary"
                :items="formComponents.countries"
                label="Country"
                v-model="userData.country"
              ></v-select>
              <v-text-field
                :disabled="!editing"
                class="pt-1"
                color="secondary"
                label="Occupation"
                v-model.trim="userData.occupation"
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
import firebase from 'firebase'
import { mapState, mapGetters, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { helpers, required, email, sameAs, minLength } from 'vuelidate/lib/validators'
const optionnalPasswordRule = (value) => !helpers.req(value) || value.length >= 6

export default {
  comments: true,
  name: 'ProfileForm',
  data () {
    return {
      editing: false,
      authUser: null,
      updateAccountCatchError: '',
      formComponents: {
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
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    formComponents: {
      repeatPassword: {
        sameAsPassword: sameAs('password')
      }
    },
    userData: {
      pseudo: { required },
      email: { required, email },
      password: {
        optionnalPasswordRule,
        // required: requiredIf(function () {
        //   return this.userData.password.length > 0
        // }),
        minLength: minLength(6)
      }

    }
  },
  computed: {
    ...mapState({
      utility: state => state.utility
    }),
    ...mapGetters({
      userData: 'profile/getProfileData',
      getCountries: 'utility/getCountries'
    }),
    pseudoErrors () {
      const errors = []
      if (!this.$v.userData.pseudo.$dirty) return errors
      !this.$v.userData.pseudo.required && errors.push('Pseudo is required')
      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.userData.email.$dirty) return errors
      !this.$v.userData.email.email && errors.push('Must be a valid e-mail')
      !this.$v.userData.email.required && errors.push('Email is required')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.userData.password.$dirty) return errors
      !this.$v.userData.password.required && errors.push('Password is required')
      !this.$v.userData.password.minLength && errors.push(`Password must have at least ${this.$v.userData.password.$params.minLength.min} letters.`)
      return errors
    },
    genderUpdate () {
      return this.userData.gender
    }
  },
  watch: {
    genderUpdate: {
      handler (val, oldVal) {
        if (val === 'Undefined' || val === '' || val === 'Male') {
          this.userData.avatarDefault = 'man'
        } else {
          this.userData.avatarDefault = 'woman'
        }
      },
      deep: true,
      immediate: true
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
      this.$v.userData.$touch()
      if (this.$v.userData.$invalid) {
        // Throw form errors
        console.log('invalid form')
      } else {
        // Validation passed
        console.log('valid form')
        // Account update before record

        firebase.auth().currentUser.updateEmail(this.userData.email)
        firebase.auth().currentUser.updatePassword(this.userData.password)
          .then(() => { this.userData.password = '' })
          .catch((error) => {
            console.log('catch message = ' + error.message)
            this.updateAccountCatchError = error.message
          })
        // Profile datas update (vuex + firebase)
        // const userData = JSON.parse(JSON.stringify(this.userData))
        // this.updateProfile(userData).then(() => {
        //   EventBus.$emit('updateFirebase')
        //   EventBus.$emit('editProfile', false)
        //   this.toggleProfileDialog(false)
        // })
      }
    }
  },
  created () {
    console.log('password.length = ' + this.userData.password.length)

    this.formComponents.countries = this.getCountries

    EventBus.$on('editProfile', (status) => {
      this.editing = status
    })
    EventBus.$on('saveProfile', () => {
      this.saveProfile()
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
      right: -9px;
      bottom: -9px;
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
  .updateAccountCatchError {
    color: red;
    font-size: 12px;
  }
}
</style>
