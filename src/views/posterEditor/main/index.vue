<template>
  <div ref="main" class="poster-editor-main" @contextmenu.prevent="">
    <div ref="mainPanelScrollContent" class="main-panel-scroll-content">
      <div class="main-panel-contaienr">
        <main-panel ref="mainPanel" @openContextmenu="openContextmenu" />
      </div>
    </div>
    <div class="mask" :style="maskStyle" />
    <ruler-component />
    <bottom-bar />
    <custom-contextmenu
      v-if="contextmenuVisible"
      v-clickoutside="closeContextmenu"
      v-bind="contextmenuPosition"
      :menu-list="menuList"
      @executeCommand="executeContextCommand"
    />
  </div>
</template>

<script>
import mainPanel from './mainPanel'
import _throttle from 'lodash/throttle'
import rulerComponent from './ruler'
import { mapMutations, mapState } from 'poster/poster.vuex'
import bottomBar from './bottomBar'
import customContextmenu from 'poster/components/customContextmenu'
import { clickoutside } from 'poster/poster.directives'

import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
import ScrollBar from '@better-scroll/scroll-bar'
export default {
  components: { mainPanel, rulerComponent, bottomBar, customContextmenu },
  directives: { clickoutside },
  data() {
    return {
      count: 1,
      maskBorderWidth: '',
      maskHeight: 0,
      contextmenuVisible: false,
      contextmenuPosition: { x: 0, y: 0 },
      menuList: []
    }
  },
  computed: {
    ...mapState(['canvasSize', 'mainPanelScrollY']),
    maskStyle() {
      return {
        height: this.maskHeight + 'px',
        borderWidth: this.maskBorderWidth,
        transform: `translateY(${this.mainPanelScrollY}px)`
      }
    }
  },
  watch: {
    canvasSize: {
      handler() {
        this.getMaskSize()
        // mainPanel的size改变后有400ms的transition
        setTimeout(() => {
          this.BScroll.refresh()
        }, 500)
      },
      deep: true
    }
  },
  mounted() {
    this.getMaskSizeThrottle = _throttle(this.getMaskSize, 300)
    window.addEventListener('resize', this.getMaskSizeThrottle)
    this.getMaskSize()
    this.initScroll()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getMaskSizeThrottle)
  },
  methods: {
    ...mapMutations(['SET_CANVAS_POSITION', 'SET_SCROLL_Y']),
    /**
     * 重新设置mask的size和canvas的position
     */
    getMaskSize() {
      const mainRef = this.$refs.main
      const left = (mainRef.clientWidth - this.canvasSize.width) / 2
      const top = 50
      const bottom = Math.max(
        50,
        mainRef.clientHeight - top - this.canvasSize.height
      )
      this.maskBorderWidth = `${50}px ${Math.max(
        0,
        left
      )}px ${bottom}px ${Math.max(0, left)}px`
      this.maskHeight = Math.max(
        mainRef.clientHeight,
        this.canvasSize.height + 100
      )
      const canvasPosition = {
        top: 50,
        left: (mainRef.clientWidth - this.canvasSize.width) / 2
      }
      this.SET_CANVAS_POSITION(canvasPosition)
    },
    openContextmenu({ x, y, menuList, vm }) {
      this.contextmenuPosition.x = x
      this.contextmenuPosition.y = y
      this.menuList = menuList
      this._currentContextmenuWidgetVm = vm
      this.contextmenuVisible = true
    },
    closeContextmenu() {
      this.contextmenuVisible = false
    },
    // 执行右键命令
    executeContextCommand(commandItem) {
      this.closeContextmenu()
      const vm = this._currentContextmenuWidgetVm
      if (vm && vm._executeContextCommand) {
        vm._executeContextCommand(commandItem)
      }
    },
    initScroll() {
      BScroll.use(MouseWheel)
      BScroll.use(ScrollBar)
      this.BScroll = new BScroll(this.$refs.mainPanelScrollContent, {
        mouseWheel: true,
        scrollbar: true,
        bounce: false,
        probeType: 2
      })
      this.BScroll.on('mousewheelMove', ({ y }) => {
        this.SET_SCROLL_Y(y)
      })
      this.BScroll.on('scroll', ({ y }) => {
        this.SET_SCROLL_Y(y)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.poster-editor-main {
  /* background-color: #d6d6d6; */
  position: relative;
  overflow: hidden;
  .main-panel-scroll-content {
    width: 100%;
    height: 100%;
    cursor: grab;
  }
  .main-panel-contaienr {
    width: 100%;
    padding: 50px 0;
    position: relative;
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
    border-color: rgba($color: rgb(0, 0, 0), $alpha: 0.5);
    box-sizing: border-box;
    left: 0;
    top: 0;
    pointer-events: none;
  }
}
</style>
