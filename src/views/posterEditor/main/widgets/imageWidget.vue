<template>
  <vue-draggable-resizable
    :w="dragInfo.w"
    :h="dragInfo.h"
    :x="dragInfo.x"
    :y="dragInfo.y"
    :r="dragInfo.rotateZ"
    :min-width="10"
    :min-height="10"
    :resizable="true"
    :active.sync="isActive"
    class="drag-item"
    deselect-cancel="#image-control"
    @dragging="onDrag"
    @resizing="onResize"
    @rotating="onRotate"
  >
    <img
      ref="image"
      :src="item.src"
      class="qr-code"
      style="width:100%;height:100%"
    >
    <portal v-if="isActive" to="widgetControl">
      <image-control
        :drag-info="dragInfo"
        @dragInfoChange="dragInfo = $event"
      />
    </portal>
  </vue-draggable-resizable>
</template>

<script>
import vueDraggableResizable from '@/components/dragable/components/vue-draggable-resizable'
import imageControl from '../../control/widgets/imageControl'
export default {
  components: { vueDraggableResizable, imageControl },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isActive: false,
      dragInfo: {
        w: 100,
        h: 100,
        x: 0,
        y: 0,
        rotateZ: 0
      }
    }
  },
  methods: {
    onResize(x, y, w, h) {
      this.dragInfo.w = w
      this.dragInfo.h = h
      this.dragInfo.x = x
      this.dragInfo.y = y
    },
    onDrag(x, y) {
      this.dragInfo.x = x
      this.dragInfo.y = y
    },
    onRotate(e) {
      this.dragInfo.rotateZ = (e > 0 ? e : 360 + e) % 360
    }
  }
}
</script>
<style lang="scss" scoped>
.drag-item {
  user-select: none;
}
</style>
