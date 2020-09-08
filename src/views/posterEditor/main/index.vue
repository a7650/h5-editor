<template>
  <div ref="main" class="poster-editor-main">
    <div ref="mainPanelScrollContent" class="main-panel-scroll-content">
      <div class="main-panel-contaienr">
        <main-panel ref="mainPanel" />
        <!-- <div class="mask" :style="maskStyle" /> -->
      </div>
    </div>
    <ruler-component />
    <bottom-bar />
  </div>
</template>

<script>
import mainPanel from './mainPanel'
import _throttle from 'lodash/throttle'
import rulerComponent from './ruler'
import { mapMutations, mapState } from 'poster/poster.vuex'
import bottomBar from './bottomBar'
import BScroll from 'better-scroll'
export default {
  components: { mainPanel, rulerComponent, bottomBar },
  data() {
    return {
      count: 1,
      maskBorderWidth: ''
    }
  },
  computed: {
    ...mapState({
      canvasSize: (state) => state.canvasSize
    }),
    maskStyle() {
      return {
        borderWidth: this.maskBorderWidth
      }
    }
  },
  watch: {
    canvasSize: {
      handler() {
        this.getMaskSize()
      },
      deep: true
    }
  },
  mounted() {
    this.getMaskSizeThrottle = _throttle(this.getMaskSize, 300)
    window.addEventListener('resize', this.getMaskSizeThrottle)
    this.getMaskSize()
    this.bs = new BScroll(this.$refs.mainPanelScrollContent, {
      mouseWheel: true,
      probeType: 2,
      click: true,
      scrollY: true,
      scrollbar: true
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getMaskSizeThrottle)
  },
  methods: {
    ...mapMutations(['SET_CANVAS_POSITION']),
    getMaskSize() {
      const mainRef = this.$refs.main
      this.maskBorderWidth = `${50}px ${Math.max(
        0,
        (mainRef.clientWidth - this.canvasSize.width) / 2
      )}px ${Math.max(
        0,
        mainRef.clientHeight - this.canvasSize.height - 50
      )}px ${Math.max(0, (mainRef.clientWidth - this.canvasSize.width) / 2)}px`
      const canvasPosition = {
        top: 50,
        left: (mainRef.clientWidth - this.canvasSize.width) / 2
      }
      console.log(this.maskBorderWidth)
      this.SET_CANVAS_POSITION(canvasPosition)
    }
  }
}
</script>
<style lang="scss" scoped>
.poster-editor-main {
  background-color: #d6d6d6;
  position: relative;
  overflow: hidden;
  .main-panel-scroll-content {
    width: 100%;
    height: 100%;
  }
  .main-panel-contaienr {
    width: 100%;
    padding: 50px 0;
    /* overflow-y: scroll; */
    /* display: flex; */
    /* justify-content: center; */
    /* padding: 50px 0; */
  }
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
