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
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { EventBus } from '@/bus'
import firebase from 'firebase'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      authUser: null,
      displayName: null,
      email: '',
      password: '',
      newPassword: null
    }
  },
  computed: {
    ...mapState({
      profile: state => state.profile,
      utility: state => state.utility
    }),
    ...mapGetters({
      'userData': 'profile/getProfileData'
    })
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
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
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
}
</style>
