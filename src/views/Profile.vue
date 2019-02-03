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
    </v-container>
    <ProfileEditor/>
  </div>
</template>

<script>
import ProfileForm from '@/components/ProfileForm'
import ProfileEditor from '@/components/ProfileEditor'
import { mapActions } from 'vuex'
import { EventBus } from '@/bus'

export default {
  name: 'Profile',
  components: {
    ProfileForm,
    ProfileEditor
  },
  methods: {
    ...mapActions([
      'toggleProfileDialog'
    ]),
    handleEditProfile () {
      EventBus.$emit('editProfile', true)
      this.toggleProfileDialog(true)
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
