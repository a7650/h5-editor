<template>
  <div ref="main" class="poster-editor-main">
    <main-panel ref="mainPanel" />
    <div class="mask" :style="maskStyle" />
  </div>
</template>

<script>
import mainPanel from './mainPanel'
import _throttle from 'lodash/throttle'

export default {
  components: { mainPanel },
  data() {
    return {
      count: 1,
      maskBorderWidth: ''
    }
  },
  computed: {
    maskStyle() {
      return {
        borderWidth: this.maskBorderWidth
      }
    }
  },
  mounted() {
    this.getMaskSizeThrottle = _throttle(this.getMaskSize, 300)
    window.addEventListener('resize', this.getMaskSizeThrottle)
    this.getMaskSize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getMaskSizeThrottle)
  },
  methods: {
    getMaskSize() {
      const mainRef = this.$refs.main
      const panelRef = this.$refs.mainPanel.$el
      this.maskBorderWidth = `${(mainRef.clientHeight - panelRef.clientHeight) /
        2}px ${(mainRef.clientWidth - panelRef.clientWidth) / 2}px`
      console.log(this.maskBorderWidth)
    }
  }
}
</script>
<style lang="scss" scoped>
.poster-editor-main {
  background-color: rgb(211, 211, 211);
  position: relative;
  overflow: hidden;
  .mask {
    width: 100%;
    height: 100%;
    position: absolute;
    border-style: solid;
    border-color: rgba($color: #fff, $alpha: 0.7);
    box-sizing: border-box;
    left: 0;
    top: 0;
    pointer-events: none;
  }
}
</style>
