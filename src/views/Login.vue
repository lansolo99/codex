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

          <!-- Sign-up -->
          <div v-if="loginDisplay === 'signUp'">
            <v-form ref="profileForm" lazy-validation>
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
                  :type="password"
                  class="pt-1 mt-3"
                  color="secondary"
                  label="Password"
                  v-model.trim="password"
                  :error-messages="passwordErrors"
                  @input="$v.password.$touch()"
                  @blur="$v.password.$touch()"
                ></v-text-field>
                <v-btn large block depressed flat outline class="mt-3">Sign Up</v-btn>
                <v-layout justify-center class="mt-2">
                  <a class="passwordForgotten" href>Forgot your password ?</a>
                </v-layout>
              </v-card>
            </v-form>
            <v-layout class="mx-4 mt-3" justify-center>
              <v-btn large @click="backToAllButtons" class="red white--text">Back</v-btn>
            </v-layout>
          </div>

          <!-- All Buttons -->
          <div v-if="loginDisplay === 'allButtons'">
            <v-layout>
              <v-flex xs12>
                <v-btn block large @click="emailSignUp">Sign Up</v-btn>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12>
                <v-btn block large class="colorGreen white--text" @click="emailSignIn">Email Sign In</v-btn>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12>
                <v-btn large class="colorGoogle white--text" block @click="signInWithGoogle">Google</v-btn>
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
                >Test as guest</v-btn>
              </v-flex>
            </v-layout>
            <v-layout v-if="authUser" class="mx-4">
              <v-flex xs12>
                <v-btn block large @click="signOut" class="red white--text">Sign out</v-btn>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

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
      displayName: null,
      pseudo: null,
      email: '',
      password: '',
      newPassword: null,
      loginDisplay: 'allButtons'
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
      !this.$v.password.minLength && errors.push(`Password must have at least ${this.$v.userData.password.$params.minLength.min} letters.`)
      return errors
    }
  },
  methods: {
    ...mapActions({
      setUser: 'utility/setUser',
      appReady: 'utility/appReady',
      tasksReady: 'utility/tasksReady',
      updateProfile: 'profile/updateProfile'
    }),
    emailSignUp () {
      console.log('firebase email signup')
      this.loginDisplay = 'signUp'
      // firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
    },
    emailSignIn () {
      console.log('firebase email signin')
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => { this.authUser = user })
        .catch(error => console.log(error.message))
    },
    signInWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
        .then(user => {
          console.log('user logged with google')
          // Define user in state & utility store

          this.authUser = user
          EventBus.$emit('storeAuthUser', user.user)
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
    updateAccount () {
      this.authUser.updateEmail(this.email)
      this.authUser.updatePassword(this.newPassword)
        .then(() => { this.newPassword = '' })
        .catch((error) => console.log('catch message = ' + error.message))
    },
    updateCustomDetails () {
      firebase.database().ref('users').child(this.authUser.uid)
        .update({ gender: this.gender })
        .then(user => console.log('ok done' + user.data))
    },
    signOut () {
      console.log('firebase sign out')
      firebase.auth().signOut()
      this.authUser = null
      this.setUser('null')
      this.displayName = null
      this.email = ''
    },
    successRedirect () {
      this.$router.push({ name: 'tasks' })
    },
    backToAllButtons () {
      this.loginDisplay = 'allButtons'
    }
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      this.authUser = user
      // Only update data if user object exists (to prevent that sign-out empty the datas)
      if (user) {
        this.email = user.email
        this.displayName = user.displayName
        firebase.database().ref('users').child(user.uid).once('value', snap => {
          if (snap.val()) {
            this.gender = snap.val().gender
            // Vue.set(this.authUser, 'gender', this.gender)
          }
        })
      }
    })

    EventBus.$on('signOut', () => {
      this.signOut()
    })
  }
}
</script>

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
}
</style>
