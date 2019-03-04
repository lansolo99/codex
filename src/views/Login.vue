<template>
  <div class="login">
    <v-container fill-height>
      <v-layout align-center class="elementsWrapper mx-4">
        <!-- USER AUTENTHICATED -->
        <!-- <div v-if="authUser">
        <p>Signed in as {{authUser.email}}</p>
        <v-btn @click="signOut">Sign out</v-btn>
        <p>gender = {{ authUser.gender}}</p>

        <h3>Update profile infos (google)</h3>
        <v-form>
          <v-layout>
            <v-text-field v-model="displayName" label="Display name"></v-text-field>
          </v-layout>
          <v-layout>
            <v-text-field v-model="photoUrl" label="Photo URL"></v-text-field>
          </v-layout>
          <v-btn @click="updateProfile">Update profile</v-btn>
        </v-form>

        <h3>Update account infos (email + pwd)</h3>
        <v-form>
          <v-layout>
            <v-text-field v-model="email" label="email"></v-text-field>
          </v-layout>
          <v-layout>
            <v-text-field v-model="newPassword" label="Password"></v-text-field>
          </v-layout>
          <v-btn @click="updateAccount">Update account</v-btn>
        </v-form>

        <h3>Update additionnal infos (genre)</h3>
        <v-form>
          <v-layout>
            <v-text-field v-model="gender" label="gender"></v-text-field>
          </v-layout>
          <v-btn @click="updateCustomDetails">Update additionnal infos</v-btn>
        </v-form>
        </div>-->
        <!-- End authenticated -->
        <v-flex xs12>
          <v-layout>
            <v-flex xs12>
              <img class="logo my-3 mb-5" src="@/assets/images/logo.svg">
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-btn block large>Sign Up</v-btn>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-btn block large class="colorGreen white--text">Email Sign In</v-btn>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-btn large class="colorGoogle white--text" block @click="signInWithGoogle">Google</v-btn>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-btn to="/tasks" block large class="secondary white--text">Test as guest</v-btn>
            </v-flex>
          </v-layout>
          <v-layout v-if="authUser">
            <v-flex xs12>
              <v-btn block large @click="signOut">Sign out</v-btn>
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
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      authUser: null,
      pseudo: null,
      email: '',
      password: '',
      newPassword: null,
      gender: null
    }
  },
  computed: {
    ...mapState({
      profile: state => state.profile,
      utility: state => state.utility
    })
  },
  methods: {
    ...mapActions({
      setUser: 'utility/setUser'
    }),
    register () {
      console.log('firebase register')
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
    },
    signIn () {
      console.log('firebase sign in')
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => { this.authUser = user })
        .catch(error => console.log(error.message))
    },
    signInWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
        .then(user => {
          console.log('user logged with google')
          this.authUser = user
          this.setUser(this.authUser.user.uid)
          EventBus.$emit('initFirebase')
          // firebase
          //   .database()
          //   .ref('users')
          //   .child(this.utility.authUserID)
          //   .once('value', snapshot => {
          //     if (snapshot.exists()) {
          //       console.log('user exists')
          //     } else {
          //       console.log('user doesnt exists')

          //       firebase.database().ref('users').child(this.utility.authUserID)
          //         .set({ profile: 'test' })
          //         .then(user => console.log('early node basically created'))
          //     }
          //   })
        })
        .catch((error) => console.log('catch message = ' + error.message))
    },
    updateProfile () {
      console.log('updateProfile')
      this.authUser.updateProfile({
        displayName: this.displayName,
        photoURL: this.photoUrl
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
      this.displayName = null
      this.email = ''
      this.email = ''
    }
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      this.authUser = user
      // Only update data if user object exists (to prevent sign out empty the datas)
      if (user) {
        this.displayName = user.displayName
        this.photoUrl = user.photoURL
        this.email = user.email
        firebase.database().ref('users').child(user.uid).once('value', snap => {
          if (snap.val()) {
            this.gender = snap.val().gender
            Vue.set(this.authUser, 'gender', this.gender)
          }
        })
      }
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
