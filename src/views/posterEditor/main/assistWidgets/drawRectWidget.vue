<template>
  <div class="draw-rect-widget">
    <div
      class="drawing-container"
      :class="{ dragging: dragging }"
      @mousedown="dragStart"
      @mousemove="moving"
      @mouseup="dragEnd"
    >
      <div class="tip">在此区域内拖动</div>
      <div v-if="dragging" class="dragging-rect" :style="draggingRectStyle">
        {{ `${draggingRectStyle.width} x ${draggingRectStyle.height}` }}
      </div>
    </div>
  </div>
</template>

<script>
import { RectWidget } from 'poster/widgetConstructor'
import { clickoutside } from 'poster/poster.directives'
// import textControl from 'poster/control/widgets/textControl'
import { mapState, mapActions } from 'poster/poster.vuex'
export default {
  directives: { clickoutside },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  // mixins: [RectWidget.widgetMixin({ openContextmenu: false })],
  data() {
    return {
      dragging: false,
      drawInfo: null,
      draggingRectStyle: null
    }
  },
  computed: {
    ...mapState(['canvasSize'])
  },
  methods: {
    ...mapActions(['setWidgetConfig', 'removeAssistWidget', 'addItem']),
    removeSelf() {
      this.removeAssistWidget(this.item)
    },
    dragStart(e) {
      this.dragging = true
      this.drawInfo = {
        startX: e.offsetX,
        startY: e.offsetY,
        startPageX: e.pageX,
        startPageY: e.pageY
      }
      this.draggingRectStyle = {
        width: 0,
        height: 0,
        top: e.offsetY + 'px',
        left: e.offsetX + 'px'
      }
    },
    moving(e) {
      if (!this.dragging) {
        return
      }
      const width = Math.abs(e.pageX - this.drawInfo.startPageX)
      const height = Math.abs(e.pageY - this.drawInfo.startPageY)
      const top =
        e.pageY < this.drawInfo.startPageY
          ? this.drawInfo.startY - height
          : this.drawInfo.startY
      const left =
        e.pageX < this.drawInfo.startPageX
          ? this.drawInfo.startX - width
          : this.drawInfo.startX
      this.draggingRectStyle.width = parseInt(width) + 'px'
      this.draggingRectStyle.height = parseInt(height) + 'px'
      this.draggingRectStyle.top = top + 'px'
      this.draggingRectStyle.left = left + 'px'
    },
    dragEnd(e) {
      if (e.button === 2) {
        this.removeSelf()
        return
      }
      if (!this.dragging) {
        return
      }
      this.dragging = false
      this.drawInfo = null
      const rectInfo = {
        width: parseInt(this.draggingRectStyle.width),
        height: parseInt(this.draggingRectStyle.height),
        top: parseInt(this.draggingRectStyle.top),
        left: parseInt(this.draggingRectStyle.left)
      }
      this.draggingRectStyle = null
      this.removeSelf()
      this.addItem(
        new RectWidget({
          dragInfo: {
            w: Math.max(50, rectInfo.width),
            h: Math.max(50, rectInfo.height),
            y: rectInfo.top,
            x: rectInfo.left
          }
        })
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.draw-rect-widget {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.drawing-container {
  background-color: rgba($color: #fff, $alpha: 0.8);
  box-sizing: border-box;
  border: 1px dashed $colorTheme;
  cursor: crosshair;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .tip {
    opacity: 1;
    transition: 0.3s;
    width: 100%;
    text-align: center;
    user-select: none;
    position: absolute;
    top: 50%;
    margin-top: -20px;
    color: $colorText;
    font-size: 14px;
    animation: fade 1.5s infinite;
  }
  &.dragging {
    .tip {
      opacity: 0;
      animation: none;
    }
  }
  .dragging-rect {
    position: absolute;
    background-color: $colorThemeL;
    box-sizing: border-box;
    border: 1px solid $colorTheme;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: $colorText;
    @include no-wrap;
  }
  @keyframes fade {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
