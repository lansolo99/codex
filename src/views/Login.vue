<template>
  <div class="login">
    <v-container fill-height>
      <v-layout align-center class="elementsWrapper mx-4">
        <v-flex xs12>
          <v-layout>
            <v-flex xs12>
              <img class="logo my-3 mb-5" src="@/assets/images/logo.svg">
            </v-flex>
          </v-layout>

          <!-- Sign-up form -->
          <div v-if="loginDisplay === 'signUp'">
            <v-form lazy-validation>
              <v-card class="pa-3">
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
                  v-model="email"
                  required
                  :error-messages="emailErrors"
                  @input="$v.email.$touch()"
                  @blur="$v.email.$touch()"
                ></v-text-field>
                <v-text-field
                  type="password"
                  class="pt-1 mt-3"
                  color="secondary"
                  label="Password"
                  v-model.trim="password"
                  :error-messages="passwordErrors"
                  @input="$v.password.$touch()"
                  @blur="$v.password.$touch()"
                ></v-text-field>
                <div class="signInCatchError">{{signInCatchError}}</div>
                <v-btn large block depressed flat outline class="mt-3" @click="emailSignUp">Sign Up</v-btn>
              </v-card>
            </v-form>
            <v-layout class="mx-4 mt-3" justify-center>
              <v-btn large @click="loginElementsDisplay('allButtons')" class="red white--text">Back</v-btn>
            </v-layout>
          </div>

          <!-- Sign-in form -->
          <div v-if="loginDisplay === 'signIn'">
            <v-form>
              <v-card class="pa-3">
                <v-text-field class="pt-1 mt-3" color="secondary" label="Email" v-model="email"></v-text-field>
                <v-text-field
                  type="password"
                  class="pt-1 mt-3"
                  color="secondary"
                  label="Password"
                  v-model.trim="password"
                ></v-text-field>
                <div class="signInCatchError">{{signInCatchError}}</div>
                <v-btn
                  large
                  block
                  depressed
                  flat
                  class="mt-3 colorGreen white--text"
                  @click="emailSignIn"
                >Sign In</v-btn>
                <v-layout justify-center class="mt-2">
                  <a
                    class="passwordForgotten"
                    @click="loginElementsDisplay('resetPassword')"
                  >Forgot your password ?</a>
                </v-layout>
              </v-card>
            </v-form>
            <v-layout class="mx-4 mt-3" justify-center>
              <v-btn large @click="loginElementsDisplay('allButtons')" class="red white--text">Back</v-btn>
            </v-layout>
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
            <v-layout>
              <v-flex xs12>
                <v-btn
                  block
                  large
                  class="colorGreen white--text"
                  @click="loginElementsDisplay('signIn')"
                >Email Sign In</v-btn>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12>
                <v-btn
                  large
                  class="colorGoogle white--text"
                  block
                  @click="signInWithGoogle"
                >Google Sign in</v-btn>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12>
                <v-btn
                  to="/tasks"
                  block
                  large
                  class="secondary white--text"
                  @click="signInAsGuest"
                >Test as a guest</v-btn>
              </v-flex>
            </v-layout>

            <v-layout class="mt-3">
              <v-flex xs12>
                <v-btn block large @click="loginElementsDisplay('signUp')">Email Sign Up</v-btn>
              </v-flex>
            </v-layout>
            <v-layout v-if="authUser" class="mt-3">
              <v-flex xs12>
                <v-btn block large @click="signOut" class="red white--text">Sign out helper</v-btn>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<!-- *************************************************************************
     * SCRIPT
****************************************************************************** -->

<script>
import { EventBus } from '@/bus'
import firebase from 'firebase'
import { mapState, mapGetters, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data () {
    return {
      authUser: null,
      pseudo: null,
      email: '',
      password: '',
      loginDisplay: 'allButtons',
      signInCatchError: '',
      resetPasswordCatchError: '',
      resetPasswordResolved: ''
    }
  },
  mixins: [validationMixin],
  validations: {
    pseudo: { required },
    email: { required, email },
    password: {
      required,
      minLength: minLength(6)
    }
  },
  computed: {
    ...mapState({
      profile: state => state.profile,
      utility: state => state.utility
    }),
    ...mapGetters({
      'userData': 'profile/getProfileData'
    }),
    pseudoErrors () {
      const errors = []
      if (!this.$v.pseudo.$dirty) return errors
      !this.$v.pseudo.required && errors.push('Pseudo is required')
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
      updateProfile: 'profile/updateProfile',
      resetProfileDatas: 'profile/resetProfileDatas',
      resetUtilityDatas: 'utility/resetUtilityDatas',
      resetCurrentUserWeek: 'time/resetCurrentUserWeek',
      resetTasksDatas: 'tasks/resetTasksDatas'
    }),
    emailSignUp () {
      console.log('firebase email signup')
      // Form validation
      this.$v.$touch()
      if (this.$v.$invalid) {
        // Throw form errors
        console.log('invalid form')
      } else {
        // Validation passed
        console.log('valid form')
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(user => {
            console.log('createdUserWithEmailAndPassword')

            // User object to vuex (the one we want to keep)
            this.setAuthUser(JSON.parse(JSON.stringify(user)))

            // User object to login.vue local data (eventually keep for local forms)
            this.authUser = user

            // User object to app.vue local data (Maybe delete this once vuex is resolved)
            EventBus.$emit('storeAuthUser', user.user)

            // authUserID & authUserEmail to vuex (Maybe delete this once vuex is resolved)
            this.setUser(this.authUser.user)

            this.userData.email = this.authUser.user.email
            this.userData.pseudo = this.pseudo
            this.userData.password = this.password

            this.updateProfile(this.userData).then(() => {
            // InitFirebase & route to tasks
              EventBus.$emit('initFirebase')
              this.successRedirect()
            })
          })
          .catch(error => {
            this.signInCatchError = error.message
          })
      }
    },
    emailSignIn () {
      console.log('firebase email signin')
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          // User object to vuex (the one we want to keep)
          this.setAuthUser(JSON.parse(JSON.stringify(user)))

          // User object to login.vue local data (eventually keep for local forms)
          this.authUser = user

          // User object to app.vue local data (Maybe delete this once vuex is resolved)
          EventBus.$emit('storeAuthUser', user.user)

          // authUserID & authUserEmail to vuex (Maybe delete this once vuex is resolved)
          this.setUser(this.authUser.user)

          // InitFirebase & route to tasks
          EventBus.$emit('initFirebase')
          this.successRedirect()
        })
        .catch(error => {
          this.signInCatchError = error.message
        })
    },
    signInWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
        .then(user => {
          console.log('user logged with google')

          // User object to vuex (the one we want to keep)
          this.setAuthUser(JSON.parse(JSON.stringify(user)))

          // User object to login.vue local data (eventually keep for local forms)
          this.authUser = user

          // User object to app.vue local data (Maybe delete this once vuex is resolved)
          EventBus.$emit('storeAuthUser', user.user)

          // authUserID & authUserEmail to vuex (Maybe delete this once vuex is resolved)
          this.setUser(this.authUser.user)

          this.userData.email = this.authUser.user.email
          this.userData.pseudo = this.authUser.user.displayName

          this.updateProfile(this.userData).then(() => {
            // InitFirebase & route to tasks
            EventBus.$emit('initFirebase')
            this.successRedirect()
          })
        })
        .catch((error) => console.log('catch message = ' + error.message))
    },
    signInAsGuest () {
      this.setUser('guest')
      // Init connextionDateLast to current time
      this.userData.connexionDateLast = Date.now()
      this.updateProfile(this.userData).then(() => {
        // Set data & route to tasks
        this.appReady()
        this.tasksReady()
        EventBus.$emit('globalUpdate')
        this.successRedirect()
      })
    },
    signOut () {
      console.log('firebase sign out')
      firebase.auth().signOut()
      this.resetDatas()
    },
    successRedirect () {
      this.$router.push({ name: 'tasks' })
    },
    resetDatas () {
      // Reset vuex profile
      this.resetProfileDatas()
      this.resetUtilityDatas()
      this.resetCurrentUserWeek()
      this.resetTasksDatas()
      // this.$store.tasks.replaceState({})
      // Reset forms
      // this.$v.$reset()
      // Reset local datas
      this.authUser = null
      this.setUser('null')
      this.pseudo = null
      this.email = ''
      this.password = ''
      this.signInCatchError = ''
      this.resetPasswordCatchError = ''
      this.resetPasswordResolved = ''
    },
    loginElementsDisplay (configuration) {
      // Elements to display
      this.loginDisplay = configuration
      this.resetDatas()
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
    }
  },
  created () {
    // Auth state observer
    firebase.auth().onAuthStateChanged(user => {
      console.log('onAuthStateChanged')

      if (user) {
        this.authUser = user
        console.log('user is signed in')
      } else {
        console.log('user is signed out')
      }
    })

    EventBus.$on('signOut', () => {
      this.signOut()
    })
  }
}
</script>

<!-- *************************************************************************
     * STYLE
****************************************************************************** -->

<style lang="scss">
.login {
  height: 100%;
  .logo {
    max-width: 120px;
    display: block;
    margin: auto;
    text-align: center;
  }

  background: url("../assets/images/app_theme.jpg");
  background-image: -webkit-image-set(
    url("../assets/images/app_theme.jpg") 1x,
    url("../assets/images/app_theme@2x.jpg") 2x
  );
  background-size: cover;
  background-repeat: no-repeat;

  .passwordForgotten {
    color: gray;
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
}
</style>
