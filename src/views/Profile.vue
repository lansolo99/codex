<template>
  <div class="profile">
    <v-container>
      <!-- Header -->
      <v-layout>
        <v-flex
          grow
          self-align
          center
        >
          <h1 class="black--text">Profile</h1>
        </v-flex>
      </v-layout>
      <!-- Form -->
      <ProfileForm />

      <v-layout
        v-if="utility.authUserID"
        class="mx-3 mt-4 mb-2"
        justify-center
      >
        <v-btn
          block
          large
          center
          @click="signOut"
          class="colorGreen white--text"
        >Sign out</v-btn>
      </v-layout>
    </v-container>
    <v-container class="primary darken-1">
      <!-- Reset account -->
      <v-layout
        class="mx-3 mt-2 mb-2"
        justify-center
      >
        <v-btn
          large
          center
          color="primary white--text px-5"
          @click="dialogResetAccount = true"
        >Reset my account</v-btn>
        <Dialog
          :vmodel="dialogResetAccount"
          title="Reset my account?"
          color="red"
          :persistent="true"
          @closeDialog="dialogResetAccount = false"
        >
          <template v-slot:body>
            You will loose all your task and progression since the beginning!
          </template>
          <template v-slot:actions>
            <v-btn
              color="red darken-1"
              flat="flat"
              @click="dialogResetAccount = false"
            >Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              flat="flat"
              @click="resetAccount()"
            >Agree</v-btn>
          </template>
        </Dialog>
      </v-layout>
      <Dialog
        :vmodel="dialogResetAccountConfirmation"
        title="Reset done!"
        color="green"
        :persistent="true"
        @closeDialog="dialogResetAccountConfirmation = false"
      >
        <template v-slot:body>
          Let's start over again ...
        </template>
        <template v-slot:actions>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialogResetAccountConfirmation = false"
          >Ok</v-btn>
        </template>
      </Dialog>
    </v-container>
    <v-container class="primary darken-2">
      <!-- Delete account -->
      <v-layout
        class="mx-3 mt-2 mb-2"
        justify-center
      >
        <v-btn
          large
          center
          color="red white--text px-5"
          @click="dialogDeleteAccount= true"
        >Delete my account</v-btn>
        <Dialog
          :vmodel="dialogDeleteAccount"
          title="Delete my account?"
          color="red"
          :persistent="true"
          @closeDialog="dialogDeleteAccount = false"
        >
          <template v-slot:body>
            Your account will be deleted forever and couldn't be restored.
            All recorded data will be lost
          </template>
          <template v-slot:actions>
            <v-btn
              color="red darken-1"
              flat="flat"
              @click="dialogDeleteAccount = false"
            >Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              flat="flat"
              @click="deleteAccount()"
            >Agree</v-btn>
          </template>
        </Dialog>
        <!-- Delete account : network needed -->
        <Dialog
          :vmodel="dialogDeleteNeedNetwork"
          title="A problem occured!"
          color="red"
          @closeDialog="dialogDeleteNeedNetwork = false"
        >
          <template v-slot:body>
            You can't delete account while offline, try again later.
          </template>
          <template v-slot:actions>
            <v-btn
              color="red darken-1"
              flat="flat"
              @click="dialogDeleteNeedNetwork = false"
            >Ok</v-btn>
          </template>
        </Dialog>
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
import Dialog from '@/components/Dialog'

export default {
  name: 'Profile',
  components: {
    ProfileForm,
    Dialog
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
