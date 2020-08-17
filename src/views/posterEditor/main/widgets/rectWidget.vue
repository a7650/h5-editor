<template>
  <vue-draggable-resizable
    ref="drag"
    :w="dragInfo.w"
    :h="dragInfo.h"
    :x="dragInfo.x"
    :y="dragInfo.y"
    :r="dragInfo.rotateZ"
    :minw="1"
    :minh="1"
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
    <div class="content" :style="rectStyleFilter" />
    <portal v-if="isActive" to="widgetControl">
      <rect-control :key="item.id" :item="item" />
    </portal>
  </vue-draggable-resizable>
</template>

<script>
import vueDraggableResizable from '@/components/dragable/components/vue-draggable-resizable'
import rectControl from '../../control/widgets/rectControl'
import { RectWidget } from 'poster/widgetConstructor'
// import { mapGetters, mapActions } from 'poster/poster.vuex'
export default {
  components: { vueDraggableResizable, rectControl },
  mixins: [RectWidget.mixin()],
  data() {
    return {}
  },
  computed: {
    rectStyleFilter() {
      const style = this.wState.style
      return Object.assign({}, style, {
        borderWidth: style.borderWidth + 'px',
        borderTopLeftRadius: style.borderTopLeftRadius + '%',
        borderTopRightRadius: style.borderTopRightRadius + '%',
        borderBottomLeftRadius: style.borderBottomLeftRadius + '%',
        borderBottomRightRadius: style.borderBottomRightRadius + '%'
      })
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.drag-item {
  user-select: none;
  .content {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
}
</style>
