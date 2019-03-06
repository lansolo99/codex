<template>
  <div class="profile mb-4">
    <v-container>
      <!-- Header -->
      <v-layout>
        <v-flex grow self-align center>
          <h1 class="black--text">Profile</h1>
        </v-flex>
        <v-flex shrink>
          <v-btn fab small dark class="colorGreen mr-0" @click="handleEditProfile">
            <v-icon class="icon icon-edit"></v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <!-- Form -->
      <ProfileForm/>

      <v-layout v-if="utility.authUserID" class="mx-3 mt-4">
        <v-flex xs12>
          <v-btn block large @click="signOut" class="red white--text">Sign out</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <ProfileEditor/>
  </div>
</template>

<script>
import ProfileForm from '@/components/ProfileForm'
import ProfileEditor from '@/components/ProfileEditor'
import { mapState, mapActions } from 'vuex'
import { EventBus } from '@/bus'
import store from '@/store/store'

export default {
  name: 'Profile',
  components: {
    ProfileForm,
    ProfileEditor
  },
  computed: {
    ...mapState({
      utility: state => state.utility
    })
  },
  methods: {
    ...mapActions({
      toggleProfileDialog: 'utility/toggleProfileDialog'
    }),
    handleEditProfile () {
      EventBus.$emit('editProfile', true)
      this.toggleProfileDialog(true)
    },
    signOut () {
      EventBus.$emit('signOut')
      this.$router.push({ name: 'login' })
    }
  },
  beforeRouteEnter (to, from, next) {
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
