<template>
  <!-- ProfileForm -->
  <v-container class="profileForm primary">
    <v-layout row wrap class="mt-4">
      <v-flex xs-12 text-xs-center>
        <v-avatar size="80px" color="rgba(0, 0, 0, 0.4)">
          <img v-if="userData.avatarImage" src alt="Avatar">
          <img v-else :src="require(`@/assets/images/avatar/${this.userData.avatarDefault}.svg`)">
        </v-avatar>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs-12>
        <v-form ref="profileForm" lazy-validation>
          <!-- Account -->
          <div class="fieldset fieldset--account">
            <h6 class="subheader subheader--first my-3 black--text">Account</h6>
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
              :error-messages="emailErrors"
              @input="$v.userData.email.$touch()"
              @blur="$v.userData.email.$touch()"
            ></v-text-field>
            <div v-if="editing" class="fieldset fieldset--password">
              <v-text-field
                :type="formComponents.passwordType"
                class="pt-1"
                color="secondary"
                label="Password"
                v-model.trim="userData.password"
                required
                :error-messages="passwordErrors"
                @input="$v.userData.password.$touch()"
                @blur="$v.userData.password.$touch()"
              ></v-text-field>
              <v-icon
                @click="togglePasswordVisibility('password')"
                :class="['icon', formComponents.iconShowPassword, 'customIcon']"
              ></v-icon>
            </div>
          </div>
          <div class="fieldset fieldset--informations">
            <h6 class="subheader subheader--first my-3 black--text">Informations</h6>
            <v-select
              :disabled="!editing"
              class="pt-1"
              color="secondary"
              :items="formComponents.gender"
              label="Select your gender"
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
              thumb-color="white"
              thumb-size="35"
              thumb-label="always"
              color="white"
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
          </div>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { EventBus } from '@/bus'
import { mapState, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
  comments: true,
  name: 'ProfileForm',
  data () {
    return {
      editing: false,
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
        countries: [
          'France',
          'Belgium',
          'USA',
          'Spain',
          'South Africa'
        ]
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
        required,
        minLength: minLength(6)
      }

    }
  },
  computed: {
    ...mapState('profile', {
      userData: state => state
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
        if (val === 'Undefined' || val === 'Male') {
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
      toggleProfileDialog: 'toggleProfileDialog'
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
        const userData = JSON.parse(JSON.stringify(this.userData))
        this.updateProfile(userData)
        // Everything is done :
        EventBus.$emit('editProfile', false)
        this.toggleProfileDialog(false)
      }
    }
  },
  created () {
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
        color: rgba(black, 0.6);
        font-size: 14px;
      }
    }
  }
  .theme--light.v-input:not(.v-input--is-disabled) input,
  .theme--light.v-select .v-select__selections {
    color: rgba(0, 0, 0, 0.55);
  }
}
</style>
