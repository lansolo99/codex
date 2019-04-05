<template>
  <div class="login">
    <v-container fill-height>
      <v-layout align-center class="elementsWrapper mx-4">
        <v-flex xs12>
          <v-layout>
            <v-flex xs12>
              <!-- Logo -->
              <Lottie
                :options="defaultOptions"
                v-on:animCreated="handleAnimation"
                v-on:displayAllButtons="displayAllButtons = true"
              />
            </v-flex>
          </v-layout>

          <!-- Signup form -->
          <div v-if="loginDisplay === 'signUp'">
            <v-card class="signInsignUpForm">
              <v-card-title class="title primary white--text">
                Sign up
                <v-icon
                  right
                  class="white--text icon icon-delete close"
                  @click="loginElementsDisplay('allButtons')"
                ></v-icon>
              </v-card-title>
              <v-card-text class="pa-3">
                <v-form lazy-validation ref="signUpForm">
                  <v-text-field
                    color="secondary"
                    class="red--text mt-1"
                    label="Pseudo"
                    v-model="pseudo"
                    required
                    :error-messages="pseudoErrors"
                    @input="$v.pseudo.$touch()"
                    @blur="$v.pseudo.$touch()"
                  ></v-text-field>
                  <v-text-field
                    class="pt-1 mt-3"
                    color="secondary"
                    label="Email"
                    type="email"
                    v-model="email"
                    required
                    :error-messages="emailErrors"
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  ></v-text-field>
                  <div class="fieldset fieldset--password">
                    <v-text-field
                      :type="formComponents.passwordType"
                      class="pt-1 mt-3"
                      color="secondary"
                      label="Password"
                      autocorrect="off"
                      autocapitalize="none"
                      v-model.trim="password"
                      :error-messages="passwordErrors"
                      @input="$v.password.$touch()"
                      @blur="$v.password.$touch()"
                    ></v-text-field>
                    <div class="customIcon">
                      <v-icon
                        @click="togglePasswordVisibility('password')"
                        :class="['icon', formComponents.iconShowPassword]"
                      ></v-icon>
                    </div>
                  </div>
                  <div class="signInCatchError">{{signInCatchError}}</div>
                  <v-btn
                    large
                    block
                    depressed
                    flat
                    outline
                    class="mt-3"
                    @click="emailSignUp"
                  >Sign Up</v-btn>
                </v-form>
                <v-layout justify-center class="mt-4">
                  Already have an account ?&nbsp;
                  <a
                    class="simpleLink primary--text text--darken-2"
                    @click="loginElementsDisplay('signIn')"
                  >Sign in!</a>
                </v-layout>
              </v-card-text>
            </v-card>
          </div>

          <!-- Sign-in form -->
          <div v-if="loginDisplay === 'signIn'">
            <v-card class="signInsignUpForm">
              <v-card-title class="title primary white--text">
                Sign in
                <v-icon
                  right
                  class="white--text icon icon-delete close"
                  @click="loginElementsDisplay('allButtons')"
                ></v-icon>
              </v-card-title>
              <v-card-text class="pa-3">
                <v-form>
                  <v-text-field
                    class="pt-1 mt-3"
                    autocomplete="email"
                    color="secondary"
                    label="Email"
                    type="email"
                    v-model="email"
                  ></v-text-field>
                  <div class="fieldset fieldset--password">
                    <v-text-field
                      :type="formComponents.passwordType"
                      class="pt-1 mt-3"
                      autocomplete="password"
                      color="secondary"
                      label="Password"
                      autocorrect="off"
                      autocapitalize="none"
                      v-model.trim="password"
                    ></v-text-field>
                    <div class="customIcon">
                      <v-icon
                        @click="togglePasswordVisibility('password')"
                        :class="['icon', formComponents.iconShowPassword]"
                      ></v-icon>
                    </div>
                  </div>
                  <div class="signInCatchError">{{signInCatchError}}</div>
                  <v-btn
                    large
                    block
                    class="mt-3 colorGreen white--text"
                    @click="emailSignIn"
                  >Sign In</v-btn>
                  <v-layout justify-center class="mt-2">
                    <a
                      class="simpleLink primary--text text--darken-2"
                      @click="loginElementsDisplay('resetPassword')"
                    >Forgot your password ?</a>
                  </v-layout>
                  <v-layout justify-center class="mt-2">
                    <v-btn
                      large
                      outline
                      class="colorGoogle colorGoogle--text"
                      @click="signInWithGoogle"
                    >Sign in with Google</v-btn>
                  </v-layout>
                </v-form>
                <v-layout justify-center class="mt-2">
                  No account ?&nbsp;
                  <a
                    class="simpleLink primary--text text--darken-2"
                    @click="loginElementsDisplay('signUp')"
                  >Sign up!</a>
                </v-layout>
              </v-card-text>
            </v-card>
          </div>

          <!-- Reset password form -->
          <div v-if="loginDisplay === 'resetPassword'">
            <v-form>
              <v-card class="pa-3">
                <v-text-field class="pt-1 mt-3" color="secondary" label="Email" v-model="email"></v-text-field>
                <div class="resetPasswordError">{{resetPasswordCatchError}}</div>
                <div class="resetPasswordResolved">{{resetPasswordResolved}}</div>
                <v-btn
                  large
                  block
                  depressed
                  flat
                  class="mt-3 colorGreen white--text"
                  @click="resetPassword"
                >Reset my password</v-btn>
              </v-card>
            </v-form>
            <v-layout class="mx-4 mt-3" justify-center>
              <v-btn large @click="loginElementsDisplay('allButtons')" class="red white--text">Back</v-btn>
            </v-layout>
          </div>

          <!-- All Buttons -->
          <div v-if="loginDisplay === 'allButtons'">
            <v-layout
              justify-center
              class="allButtonsWrapper"
              :class="{ displayAllButtons: displayAllButtons }"
            >
              <v-flex xs12 sm7 md4>
                <v-layout>
                  <v-flex xs12>
                    <v-btn
                      block
                      large
                      class="colorGreen white--text"
                      @click="loginElementsDisplay('signUp')"
                    >Register</v-btn>
                  </v-flex>
                </v-layout>
                <v-layout>
                  <v-flex xs12>
                    <v-btn block large @click="loginElementsDisplay('signIn')">Connexion</v-btn>
                  </v-flex>
                </v-layout>
                <v-layout justify-center class="mt-3 guest">
                  <v-flex xs12 class="text-xs-center">
                    <v-btn to="/tasks" class="black white--text" @click="signInAsGuest">
                      <span>Test without account</span>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-layout v-if="authUser" class="mt-3">
                  <v-flex xs12>
                    <v-btn block large @click="signOut" class="red white--text">Sign out</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <TheInstallAppBar v-if="pwa.appInstall" @click.native="installer(pwa.appInstallOS)"/>
    <v-dialog
      v-model="dialogAppleInstall"
      max-width="350"
      content-class="standard-dialog dialogAppleInstall"
    >
      <v-card>
        <v-card-title class="title primary white--text" primary-title>
          Install the app
          <v-icon
            right
            class="white--text icon icon-delete close"
            @click="dialogAppleInstall = false"
          ></v-icon>
        </v-card-title>
        <v-card-text>
          Install this webapp on your Apple device (from your Safari browser only!) :
          <div class="mt-2">
            Tap
            <v-icon class="blue--text icon icon-apple-share mr-1"></v-icon>and then Add to homescreen
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TheInstallAppBar from '@/components/TheInstallAppBar.vue'
import { EventBus } from '@/bus'
import firebase from '@/Firebase'
import { mapState, mapGetters, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, email, minLength } from 'vuelidate/lib/validators'
import Lottie from '@/components/Lottie.vue'
import * as animationData from '@/assets/animations/data.json'
// eslint-disable-next-line
import {getStringFromIsoDay } from '@/utils'
// eslint-disable-next-line
import { getHours, getYear ,setHours } from 'date-fns'
// import { convertToLocalTime } from 'date-fns-timezone/dist/convertToLocalTime'
// import { convertToTimeZone } from 'date-fns-timezone'

function notAnExistingPseudo (value) {
  return this.allUsersPseudos.includes(value) !== true
}

export default {
  name: 'Login',
  components: {
    Lottie,
    TheInstallAppBar
  },
  data () {
    return {
      defaultOptions: {
        animationData: animationData.default
      },
      animationSpeed: 1,
      authUser: null,
      pseudo: null,
      allUsersPseudos: [],
      dialogAppleInstall: false,
      email: '',
      password: '',
      loginDisplay: 'allButtons',
      displayAllButtons: false,
      signUpProcess: false,
      signInCatchError: '',
      resetPasswordCatchError: '',
      resetPasswordResolved: '',
      installBtn: false,
      formComponents: {
        passwordType: 'password',
        iconShowPassword: 'icon-eye'
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    pseudo: {
      required,
      notAnExistingPseudo
    },
    email: { required, email },
    password: {
      required,
      minLength: minLength(6)
    }
  },
  computed: {
    ...mapState({
      profile: state => state.profile,
      utility: state => state.utility,
      pwa: state => state.pwa
    }),
    ...mapGetters({
      'userData': 'profile/getProfileData'
    }),
    pseudoErrors () {
      const errors = []
      if (!this.$v.pseudo.$dirty) return errors
      !this.$v.pseudo.required && errors.push('Pseudo is required')
      !this.$v.pseudo.notAnExistingPseudo && errors.push('Pseudo is already taken')

      return errors
    },
    emailErrors () {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.email && errors.push('Must be a valid e-mail')
      !this.$v.email.required && errors.push('Email is required')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required')
      !this.$v.password.minLength && errors.push(`Password must have at least ${this.$v.password.$params.minLength.min} letters.`)
      return errors
    }
  },
  methods: {
    ...mapActions({
      setUser: 'utility/setUser',
      setAuthUser: 'utility/setAuthUser',
      appReady: 'utility/appReady',
      tasksReady: 'utility/tasksReady',
      appInstall: 'pwa/appInstall',
      updateProfile: 'profile/updateProfile',
      resetProfileDatas: 'profile/resetProfileDatas',
      resetUtilityDatas: 'utility/resetUtilityDatas',
      resetCurrentUserWeek: 'time/resetCurrentUserWeek',
      resetTasksDatas: 'tasks/resetTasksDatas'
    }),
    emailSignUp () {
      console.log('EMAIL SIGN UP')
      // Form validation
      this.$v.$touch()
      if (this.$v.$invalid) {
        // Throw form errors
        console.log('invalid form')
      } else {
        // Validation passed
        console.log('valid form')

        // Display spinner
        EventBus.$emit('appSpinner', true)
        this.signUpProcess = true

        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(user => {
            console.log('new user created')

            // User object to local data
            this.authUser = user
            // onAuthStateChanged take hands
          })
          .catch(error => {
            this.signInCatchError = error.message
            // Hide spinner
            EventBus.$emit('appSpinner', false)
            this.signUpProcess = false
          })
      }
    },
    emailSignIn () {
      // Display spinner
      EventBus.$emit('appSpinner', true)

      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log('EMAIL SIGN IN')

          // User object to local data
          this.authUser = user
          // onAuthStateChanged take hands
        })
        .catch(error => {
          this.signInCatchError = error.message
          // Hide spinner
          EventBus.$emit('appSpinner', false)
        })
    },
    signInWithGoogle () {
      // Display spinner
      EventBus.$emit('appSpinner', true)

      const provider = new firebase.auth.GoogleAuthProvider()

      firebase.auth().signInWithRedirect(provider)
        .then(user => {
          console.log('SIGN IN WITH GOOGLE')
          this.authUser = user
          // onAuthStateChanged take hands
        })
        .catch((error) => {
          this.signInCatchError = error.message
          // Hide spinner
          EventBus.$emit('appSpinner', false)
        })
    },
    signInAsGuest () {
      console.log('TEST AS GUEST')

      // Display spinner
      EventBus.$emit('appSpinner', true)

      this.setUser('guest')
      // Init connextionDateLast to current time
      this.userData.connexionDateLast = Date.now()
      this.userData.pseudo = 'Guest'
      this.updateProfile(this.userData).then(() => {
        // Set data & route to tasks
        this.appReady()
        this.tasksReady()
        EventBus.$emit('globalUpdate')
        this.successRedirect()
      })
    },
    signOut () {
      firebase.auth().signOut()
      this.resetDatas()
    },
    successRedirect () {
      this.$router.push({ name: 'tasks' })
    },
    resetDatas () {
      // Reset vuex states
      this.resetProfileDatas()
      this.resetUtilityDatas()
      this.resetCurrentUserWeek()
      this.resetTasksDatas()
      // Reset local datas
      this.authUser = null
      this.setUser('null')
      this.pseudo = null
      this.dialogAppleInstall = null
      this.email = ''
      this.password = ''
      this.signInCatchError = ''
      this.resetPasswordCatchError = ''
      this.resetPasswordResolved = ''
    },
    loginElementsDisplay (configuration) {
      // Elements to display
      this.loginDisplay = configuration
      // Resets
      this.resetDatas()
      this.$v.$reset()
      this.formComponents = {
        passwordType: 'password',
        iconShowPassword: 'icon-eye'
      }
    },
    resetPassword () {
      const auth = firebase.auth()
      const emailAddress = this.email

      auth.sendPasswordResetEmail(emailAddress).then(() => {
        // Email sent.
        console.log('Email sent')
        this.resetPasswordResolved = 'An email has been sent to ' + this.email
      }).catch((error) => {
        this.resetPasswordCatchError = error.message
      })
    },
    togglePasswordVisibility (field) {
      this.formComponents.iconShowPassword === 'icon-eye' ? this.formComponents.iconShowPassword = 'icon-eye_hidden' : this.formComponents.iconShowPassword = 'icon-eye'
      this.formComponents.passwordType === 'password' ? this.formComponents.passwordType = 'clear' : this.formComponents.passwordType = 'password'
    },
    handleAnimation: function (anim) {
      this.anim = anim
    },
    play: function () {
      this.anim.play()
    }
  },
  mounted () {
    this.$nextTick(function () {
      // Trigger logo animation
      setTimeout(() => { this.play() }, 500)
    })
  },
  created () {
    /* =============================================
                 PWA : ADD TO HOME SCREEN
    ============================================= */
    let installPrompt

    // Listen to beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', e => {
      console.log('beforeinstallprompt')
      e.preventDefault()
      installPrompt = e
      const status = true
      const os = 'android'
      this.appInstall({ status, os, installPrompt })
    })

    // Show prompt method
    this.installer = (os) => {
      console.log('installer')
      console.log('os = ' + os)

      if (os === 'android') {
        this.pwa.installPrompt.prompt()
        // installPrompt.prompt()
        // installPrompt.userChoice.then(result => {
        this.pwa.installPrompt.userChoice.then(result => {
          if (result.outcome === 'accepted') {
            console.log('Install accepted!')
            this.appInstall(false)
          } else {
            console.log('Install denied!')
          }
        })
      } else if (os === 'apple') {
        this.dialogAppleInstall = true
      }
    }

    // Apple Install PWA homescreen feature
    const isIos = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)
    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone)

    // Checks if should display install popup notification:
    if (isIos && !isInStandaloneMode()) {
      console.log('so we are in ios in no standalone mode ?')

      const status = true
      const os = 'apple'
      this.appInstall({ status, os })
    }

    /* =============================================
                 GET PSEUDOS COLLECTION
    ============================================= */
    firebase.firestore()
      .collection('users')
      .get()
      .then(users => {
        if (users.docs.length > 0) {
          users.forEach(doc => {
            this.allUsersPseudos.push(doc.data().profile.pseudo)
          })
        } else {
          console.log('no users')
          this.allUsersPseudos = []
        }
      })

    // Firestore offline test
    firebase.firestore().collection('users')
      .onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
          if (change.type === 'added') {
            // console.log('added: ', change.doc.data())
          }
          // const source = snapshot.metadata.fromCache ? 'local cache' : 'server'
          // console.log('Data came from ' + source)
        })
      })

    /* =============================================
              FIREBASE AUTH STATE OBSERVER
    ============================================= */
    firebase.auth().onAuthStateChanged(user => {
      // console.log('onAuthStateChanged')

      if (user) {
        console.log('user is signed in')

        // // User object to local data
        this.authUser = user

        // Email + password sign-in / sign-up
        if (this.authUser.providerData[0].providerId === 'password') {
          console.log('password signin/signup in method')

          // authUserID & authUserEmail to vuex
          this.setUser(this.authUser)
          // User object to vuex
          this.setAuthUser(JSON.parse(JSON.stringify(user)))

          // If sign-up process
          if (this.signUpProcess === true) {
            this.userData.email = this.authUser.email
            this.userData.pseudo = this.pseudo
            this.userData.password = this.password
          }

          this.updateProfile(this.userData).then(() => {
            // InitFirebase & route to tasks
            EventBus.$emit('initFirebase')
            this.successRedirect()
          })
        }

        // Google sign-in
        if (this.authUser.providerData[0].providerId === 'google.com') {
          // authUserID & authUserEmail to vuex
          this.setUser(this.authUser)
          // User object to vuex
          this.setAuthUser(JSON.parse(JSON.stringify(user)))
          // Update userData
          this.userData.email = this.authUser.email
          this.userData.pseudo = this.authUser.displayName
          this.updateProfile(this.userData).then(() => {
            // InitFirebase & route to tasks
            EventBus.$emit('initFirebase')
            this.successRedirect()
          })
        }
      } else {
        console.log('user is signed out')
        // Hide spinner
        setTimeout(() => { EventBus.$emit('appSpinner', false) }, 200)
      }
    })

    EventBus.$on('signOut', () => {
      this.signOut()
    })
  }
}
</script>

<style lang="scss">
html.webp {
  .login {
    background-image: url(../assets/images/theme/desktop.jpg);
    background-image: -webkit-image-set(
      url(../assets/images/theme/desktop.webp) 1x,
      url(../assets/images/theme/desktop@2x.webp) 2x
    );

    @include responsive(tablet) {
      background-image: url(../assets/images/theme/tablet.jpg);
      background-image: -webkit-image-set(
        url(../assets/images/theme/tablet.webp) 1x,
        url(../assets/images/theme/tablet@2x.webp) 2x
      );
    }
    @include responsive(mobile) {
      background-image: url(../assets/images/theme/mobile.jpg);
      background-image: -webkit-image-set(
        url(../assets/images/theme/mobile.webp) 1x,
        url(../assets/images/theme/mobile@2x.webp) 2x
      );
    }
  }
}
.login {
  height: 100%;

  background-image: url(../assets/images/theme/desktop.jpg);
  background-image: -webkit-image-set(
    url(../assets/images/theme/desktop.jpg) 1x,
    url(../assets/images/theme/desktop@2x.jpg) 2x
  );

  @include responsive(tablet) {
    background-image: url(../assets/images/theme/tablet.jpg);
    background-image: -webkit-image-set(
      url(../assets/images/theme/tablet.jpg) 1x,
      url(../assets/images/theme/tablet@2x.jpg) 2x
    );
  }
  @include responsive(mobile) {
    background-image: url(../assets/images/theme/mobile.jpg);
    background-image: -webkit-image-set(
      url(../assets/images/theme/mobile.jpg) 1x,
      url(../assets/images/theme/mobile@2x.jpg) 2x
    );
  }

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .simpleLink {
    text-decoration: none;
  }

  .signInCatchError,
  .resetPasswordError {
    color: red;
    font-size: 12px;
  }
  .resetPasswordResolved {
    color: $color-green;
    font-size: 12px;
  }

  .fieldset {
    &--password {
      position: relative;
      .customIcon {
        width: 40px;
        height: 40px;
        position: absolute;
        right: 0px;
        top: -3px;
        //background-color: red;

        .v-icon {
          position: relative;
          top: 8px;
          left: 8px;
        }
      }
    }
  }
  // Transitions
  .allButtonsWrapper {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease-out;
    &.displayAllButtons {
      opacity: 1;
      transform: translateY(0px);
    }
    .guest {
      .v-btn__content {
        position: relative;
        top: 2px;
      }
    }
  }
  .signInsignUpForm {
    .close {
      position: absolute;
      top: 15px;
      right: 15px;
    }
  }
}
.dialogAppleInstall {
  .icon-apple-share {
    position: relative;
    top: 2px;
  }
}
</style>
