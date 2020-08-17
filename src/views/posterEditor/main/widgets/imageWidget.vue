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
    :resizable="true"
    :lock="item.lock"
    :active.sync="isActive"
    class="drag-item"
    deselect-cancel=".poster-editor_deactivated-ignore"
    @activated="activated"
    @deactivated="deactivated"
    @dragging="onDrag"
    @resizing="onResize"
    @rotating="onRotate"
    @dragstop="onDragStop"
    @rotatestop="onRotateStop"
    @resizestop="onResizeStop"
  >
    <img
      ref="image"
      :src="item.src"
      class="qr-code"
      style="width:100%;height:100%"
      ondragstart="return false"
      @load="load"
    >
    <portal v-if="isActive" to="widgetControl">
      <image-control
        :key="item.id"
        :item="item"
      />
    </portal>
  </vue-draggable-resizable>
</template>

<script>
import vueDraggableResizable from '@/components/dragable/components/vue-draggable-resizable'
import imageControl from '../../control/widgets/imageControl'
import { ImageWidget } from 'poster/widgetConstructor'
// import { mapGetters, mapActions } from 'poster/poster.vuex'
export default {
  components: { vueDraggableResizable, imageControl },
  mixins: [ImageWidget.mixin()],
  data() {
    return {}
  },
  methods: {
    load() {
      if (!this.item.isCopied) {
        const imgRef = this.$refs.image
        const width = imgRef.naturalWidth
        const height = imgRef.naturalHeight
        this.updateDragInfo({ w: 100, h: parseInt((100 * height) / width) })
      }
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
