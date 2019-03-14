<template>
  <div class="logoAnimation" ref="lavContainer"></div>
</template>

<script>
import lottie from 'lottie-web'

export default {
  props: {
    options: {
      type: Object,
      required: true
    },
    height: Number,
    width: Number
  },

  data () {
    return {
      style: {
        width: this.width ? `${this.width}px` : '100%',
        height: this.height ? `${this.height}px` : '100%',
        overflow: 'hidden',
        margin: '0 auto'
      }
    }
  },

  mounted () {
    this.anim = lottie.loadAnimation({
      container: this.$refs.lavContainer,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: this.options.animationData,
      rendererSettings: this.options.rendererSettings
    }
    )
    this.$emit('animCreated', this.anim)

    setTimeout(() => {
      // Display all sign-in methods buttons
      this.$emit('displayAllButtons')
    }, 1800)
  }
}
</script>

<style lang="scss" scoped>
.logoAnimation {
  text-align: center;
  display: block;
  margin: auto;
  width: 75%;
  max-width: 320px;
  transition: all 0.5s;
}
</style>
