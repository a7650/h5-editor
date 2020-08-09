<template>
  <div ref="main" class="poster-editor-main">
    <main-panel ref="mainPanel" />
    <div class="mask" :style="maskStyle" />
    <div ref="topRuler" class="top-ruler" />
    <div ref="leftRuler" class="left-ruler" />
  </div>
</template>

<script>
import mainPanel from './mainPanel'
import _throttle from 'lodash/throttle'
import ruler from '@/utils/canvasRuler'

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
    ruler.initRow({
      el: this.$refs.topRuler,
      height: 22,
      color: '#bac3c9',
      background: '#f4f7f8'
    })
    ruler.initColumn({
      el: this.$refs.leftRuler,
      width: 22,
      color: '#bac3c9',
      background: '#f4f7f8',
      startGap: 50 - 22
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getMaskSizeThrottle)
  },
  methods: {
    getMaskSize() {
      const mainRef = this.$refs.main
      const panelRef = this.$refs.mainPanel.$el
      this.maskBorderWidth = `${50}px ${(mainRef.clientWidth - panelRef.clientWidth) / 2}px ${mainRef.clientHeight - panelRef.clientHeight - 50}px`
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
  .top-ruler {
    position: absolute;
    top: 0;
    left: 0;
    height: 22px;
    width: 5000px;
    border-bottom: 1px solid #bac3c9;
    z-index: 3;
  }
  .left-ruler {
    position: absolute;
    top: 22px;
    left: 0;
    width: 22px;
    height: 5000px;
    border-right: 1px solid #bac3c9;
  }
}
</style>
