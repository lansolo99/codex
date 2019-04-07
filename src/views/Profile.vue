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
    <v-container class="primary darken-1">
      <!-- Reset account -->
      <v-layout class="mx-3 mt-2 mb-2" justify-center>
        <v-dialog v-model="dialogResetAccount" persistent content-class="standard-dialog">
          <v-btn slot="activator" large center color="primary white--text px-5">Reset my account</v-btn>
          <v-card>
            <v-card-title class="title red white--text pt-3 pb-3" primary-title>Reset my account?</v-card-title>

            <v-card-text>
              You will loose all your task and progression since the
              beginning!
            </v-card-text>

            <v-card-actions>
              <v-btn color="red darken-1" flat="flat" @click="dialogResetAccount = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" flat="flat" @click="resetAccount()">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
      <div></div>
      <v-dialog v-model="dialogResetAccountConfirmation" content-class="standard-dialog">
        <v-card>
          <v-card-title class="title green white--text pt-3 pb-3" primary-title>Reset done!</v-card-title>

          <v-card-text>Let's start over again ...</v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="green darken-1"
              flat="flat"
              @click="dialogResetAccountConfirmation = false"
            >Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <v-container class="primary darken-2">
      <!-- Delete account -->
      <v-layout class="mx-3 mt-2 mb-2" justify-center>
        <v-dialog
          v-model="dialogDeleteAccount"
          persistent
          max-width="350"
          content-class="standard-dialog"
        >
          <v-btn slot="activator" large center color="red white--text px-5">Delete my account</v-btn>
          <v-card>
            <v-card-title class="title red white--text pt-3 pb-3" primary-title>Delete my account?</v-card-title>

            <v-card-text>
              Your account will be deleted forever and couldn't be restored.
              All recorded data will be lost
            </v-card-text>

            <v-card-actions>
              <v-btn color="red darken-1" flat="flat" @click="dialogDeleteAccount = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" flat="flat" @click="deleteAccount()">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Delete account : network needed -->
        <v-dialog v-model="dialogDeleteNeedNetwork" persistent content-class="standard-dialog">
          <v-card>
            <v-card-title class="title red white--text pt-3 pb-3" primary-title>A problem occured!</v-card-title>

            <v-card-text>
              You can't delete account while offline, try again
              later.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="red darken-1" flat="flat" @click="dialogDeleteNeedNetwork = false">Ok</v-btn>
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
import firebase from '@/Firebase'

export default {
  name: 'Profile',
  components: {
    ProfileForm
  },
  data () {
    return {
      dialogResetAccountConfirmation: false,
      dialogDeleteAccount: false,
      dialogResetAccount: false,
      dialogDeleteNeedNetwork: false
    }
  },
  computed: {
    ...mapState({
      profile: state => state.profile,
      tasks: state => state.tasks,
      utility: state => state.utility
    })
  },
  methods: {
    ...mapActions({
      toggleProfileDialog: 'utility/toggleProfileDialog',
      resetTasksDatas: 'tasks/resetTasksDatas',
      setResetProfileProgression: 'profile/setResetProfileProgression',
      addUserToken: 'profile/addUserToken'
    }),
    ...mapMutations({
      // setResetProfileProgression: 'profile/setResetProfileProgression',
      // resetTasksDatas: 'tasks/resetTasksDatas',
      setDeleteAccount: 'utility/setDeleteAccount'
    }),
    handleEditProfile () {
      EventBus.$emit('editProfile', true)
      this.toggleProfileDialog(true)
    },
    signOut () {
      // If user has token, delete it
      if (this.profile.notifications.token !== '') {
        const context = 'signOut'
        EventBus.$emit('unsubscribeNotification', context)
      } else {
        EventBus.$emit('signOut')
        this.$router.push({ name: 'login' })
      }
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
            this.dialogDeleteNeedNetwork = true
            EventBus.$emit('appSpinner', false)
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
            this.dialogDeleteNeedNetwork = true
            EventBus.$emit('appSpinner', false)
          })
      }

      // Delete current user
      const deleteCurrentUser = () => {
        console.log('deleteCurrentUser')
        // Delete user infos
        firebase.firestore().collection('users').doc(this.utility.authUserID).delete()
          .then(() => {
            console.log('Firebase users infos removed')
            // Delete user account
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
              this.dialogDeleteNeedNetwork = true
              EventBus.$emit('appSpinner', false)
            })
          })
      }
    },
    resetAccount () {
      console.log('resetAccount')
      // Close delete account Modal
      this.dialogResetAccount = false
      this.setResetProfileProgression()
      this.resetTasksDatas('resetAccount')
        .then((res) => {
          this.dialogResetAccountConfirmation = true
          EventBus.$emit('recordProgress')
          EventBus.$emit('updateProfileDatas')
        })
    }
  },
  beforeRouteEnter (to, from, next) {
    // Prevent guests to access profile page
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
