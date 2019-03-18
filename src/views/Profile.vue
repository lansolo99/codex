<template>
  <div class="profile">
    <v-container>
      <!-- Header -->
      <v-layout>
        <v-flex grow self-align center>
          <h1 class="black--text">Profile</h1>
        </v-flex>
      </v-layout>
      <!-- Form -->
      <ProfileForm/>

      <v-layout v-if="utility.authUserID" class="mx-3 mt-4 mb-2" justify-center>
        <v-btn block large center @click="signOut" class="colorGreen white--text">Sign out</v-btn>
      </v-layout>
    </v-container>
    <!-- Delete account -->
    <v-container class="primary darken-1">
      <v-layout class="mx-3 mt-2 mb-2" justify-center>
        <v-dialog
          v-model="dialogDeleteAccount"
          persistent
          max-width="350"
          content-class="standard-dialog"
        >
          <v-btn slot="activator" large center color="red white--text px-5">Delete account</v-btn>
          <v-card>
            <v-card-title class="title red white--text pt-3 pb-3" primary-title>Delete my account?</v-card-title>

            <v-card-text>All recorded data will be lost</v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="red darken-1" flat="flat" @click="deleteAccount()">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ProfileForm from '@/components/ProfileForm'
import { mapState, mapActions, mapMutations } from 'vuex'
import { EventBus } from '@/bus'
import store from '@/store/store'
import firebase from 'firebase'

export default {
  name: 'Profile',
  components: {
    ProfileForm
  },
  data () {
    return {
      dialogDeleteAccount: false
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
      toggleProfileDialog: 'utility/toggleProfileDialog'
    }),
    ...mapMutations({
      setDeleteAccount: 'utility/setDeleteAccount'
    }),
    handleEditProfile () {
      EventBus.$emit('editProfile', true)
      this.toggleProfileDialog(true)
    },
    signOut () {
      EventBus.$emit('signOut')
      this.$router.push({ name: 'login' })
    },
    deleteAccount () {
      console.log('deleteaccount')

      // Close delete account Modal
      this.dialogDeleteAccount = false
      this.setDeleteAccount()
      // Display spinner
      EventBus.$emit('appSpinner', true)

      // Firebase user vars
      const user = firebase.auth().currentUser

      // Reauthenticate
      if (this.utility.authUser.providerData[0].providerId === 'google.com') {
        // Provider account
        console.log('google signin recognized')
        // Create provider as usual
        const provider = new firebase.auth.GoogleAuthProvider()
        user.reauthenticateWithPopup(provider)
        // user.reauthenticateWithRedirect(provider)
          .then(function (result) {
            console.log('google user reauthenticated')
            deleteCurrentUser()
          })
          .catch((error) => {
            console.log('reauthenticate user message = ' + error.message)
          })
      } else {
        // Email account
        console.log('email signin recognized')
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          this.profile.password
        )
        user.reauthenticateAndRetrieveDataWithCredential(credential)
          .then(() => {
            console.log('email user reauthenticated')
            deleteCurrentUser()
          })
          .catch((error) => {
            console.log('reauthenticate user message = ' + error.message)
          })
      }

      // Delete current user
      const deleteCurrentUser = () => {
        console.log('deleteCurrentUser')
        // Firebase delete user's infos
        firebase.database()
          .ref('users')
          .child(this.utility.authUserID)
          .remove()
          .then(() => {
            console.log('Firebase users infos removed')
            // Firebase delete user's account
            user.delete().then(() => {
              // User deleted.
              console.log('User deleted')

              // Hide spinner
              EventBus.$emit('appSpinner', false)

              // Signout event + back to login screen
              EventBus.$emit('signOut')
              this.$router.push({ name: 'login' })
            }).catch(function (error) {
              // An error happened.
              console.log(error.message)
            })
          })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // Prevent guest to access profile page
    if (store.state.utility.authUserID && store.state.utility.authUserID !== 'guest') {
      next()
    } else {
      if (store.state.utility.authUserID === 'guest') {
        next({ name: 'tasks' })
      } else {
        next({ name: 'login' })
      }
    }
  }

}
</script>

<style lang="scss">
.profile {
  h1 {
    font-size: 30px;
    opacity: 0.7;
  }
}
</style>
