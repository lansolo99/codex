<template>
  <v-dialog :value="vmodel" max-width="350" content-class="standard-dialog">
    <v-card>
      <v-card-title :class="['title white--text', color]">
        {{ title }}
        <v-icon
          right
          class="white--text icon icon-delete close"
          @click="$emit('closeDialog')"
        ></v-icon>
      </v-card-title>
      <v-card-text>
        <slot name="body"></slot>
      </v-card-text>
      <v-card-actions>
        <!-- <slot name="actions"></slot> -->
        <v-spacer></v-spacer>

        <v-btn
          color="red darken-1"
          flat="flat"
          @click="handleGuestDialog('backToLogin')"
          >Back to the launch screen</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    vmodel: {
      type: Boolean,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      mutableVmodel: this.vmodel
    }
  }
}
</script>

<style lang="scss">
.standard-dialog {
  .v-card__title {
    font-weight: 600;
    line-height: 24px;
  }
  .v-card__text {
    font-size: 16px;
    font-weight: 400;
  }
  .close {
    position: absolute;
    top: 20px;
    right: 15px;
  }
}
</style>
