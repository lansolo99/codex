<template>
  <div class="login">
    <v-container class="primary darken-2">
      <!-- USER AUTENTHICATED -->
      <div v-if="authUser">
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
      </div>

      <!-- USER NOT AUTENTHICATED -->
      <div v-else>
        <div class="register">
          <h2>Register</h2>
          <v-form>
            <v-layout>
              <v-text-field v-model="email" label="Email"></v-text-field>
            </v-layout>
            <v-layout>
              <v-text-field type="password" v-model="password" label="Password"></v-text-field>
            </v-layout>
            <v-layout>
              <v-btn @click="register">Register</v-btn>
            </v-layout>
          </v-form>
        </div>

        <div class="signIn">
          <h2>Sign In with email and pwd</h2>
          <v-form>
            <v-layout>
              <v-text-field v-model="email" label="Email"></v-text-field>
            </v-layout>
            <v-layout>
              <v-text-field type="password" v-model="password" label="Password"></v-text-field>
            </v-layout>
            <v-layout>
              <v-btn @click="signIn">Sign in</v-btn>
            </v-layout>
          </v-form>
          <h2>Sign In with Google</h2>
          <v-btn @click="signInWithGoogle">Sign in with google</v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      authUser: null,
      photoUrl: null,
      displayName: null,
      newPassword: null,
      gender: null
    }
  },
  methods: {
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
    signOut () {
      console.log('firebase sign out')
      firebase.auth().signOut()
    },
    signInWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider)
        .then(user => console.log(user.data))
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
    }
  },
  beforeCreate () {
    console.log('beforecreate')
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
}
</style>
