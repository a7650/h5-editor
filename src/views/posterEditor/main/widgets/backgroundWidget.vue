<template>
  <vue-draggable-resizable
    ref="drag"
    :w="dragInfo.w"
    :h="dragInfo.h"
    :x="dragInfo.x"
    :y="dragInfo.y"
    :r="dragInfo.rotateZ"
    :min-width="10"
    :min-height="10"
    :resizable="resizable"
    :draggable="draggable"
    :rotatable="false"
    :lock="item.lock"
    :active.sync="isActive"
    class="drag-item"
    deselect-cancel=".poster-editor_deactivated-ignore"
    @activated="activated"
    @deactivated="deactivated"
    @dragging="onDrag"
    @resizing="onResize"
    @rotating="onRotate"
  >
    <div
      v-if="item.isSolid"
      class="poster-editor-background"
      :style="{
        backgroundColor: item.backgroundColor,
        width: '100%',
        height: '100%'
      }"
    />
    <img
      v-else
      ref="image"
      :src="item.src"
      class="qr-code"
      style="width:100%;height:100%"
      ondragstart="return false"
    >
    <!-- <portal v-if="isActive" to="widgetControl">
    </portal> -->
  </vue-draggable-resizable>
</template>

<script>
import vueDraggableResizable from '@/components/dragable/components/vue-draggable-resizable'
import imageControl from '../../control/widgets/imageControl'
import { mapGetters, mapActions, mapState } from 'poster/poster.vuex'
import { BackgroundWidget } from 'poster/widgetHelpers'

export default {
  components: { vueDraggableResizable, imageControl },
  mixins: [BackgroundWidget.mixin()],
  data() {
    return {
      draggable: true,
      resizable: true
    }
  },
  computed: {
    ...mapGetters(['activeItemIds']),
    ...mapState(['canvasSize'])
  },
  created() {
    this.dragInfo.w = this.canvasSize.width
    this.dragInfo.h = this.canvasSize.height
    this.dragInfo.x = 0
    this.dragInfo.y = 0
    if (this.item.isSolid) {
      this.resizable = false
      this.draggable = false
    }
  }
}
</script>
<style lang="scss" scoped>
.drag-item {
  user-select: none;
  img {
    /* drag */
  }
}
</style>
