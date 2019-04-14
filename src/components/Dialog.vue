<template>
  <v-dialog
    :value="vmodel"
    :persistent="persistent"
    max-width="350"
    content-class="standard-dialog"
  >
    <v-card>
      <!-- Title -->
      <v-card-title :class="['title white--text', color]">
        <div class="mr-4">{{ title }}</div>

        <v-icon
          v-if="closeIcon === true"
          right
          class="white--text icon icon-delete close"
          @click="$emit('closeDialog')"
        ></v-icon>
      </v-card-title>
      <!-- Body -->
      <v-card-text>
        <slot name="body"></slot>
      </v-card-text>
      <!-- Actions -->
      <v-card-actions v-if="hasActionSlotData">
        <v-spacer></v-spacer>
        <slot name="actions"></slot>
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
    closeIcon: {
      type: Boolean
    },
    persistent: {
      type: Boolean
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
  computed: {
    hasActionSlotData () {
      return this.$slots.actions
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
