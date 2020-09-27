<template>
  <vue-draggable-resizable
    ref="drag"
    :w="dragInfo.w"
    :h="dragInfo.h"
    :x="dragInfo.x"
    :y="dragInfo.y"
    :r="dragInfo.rotateZ"
    :minw="10"
    :minh="1"
    :resizable="true"
    :lock="item.lock"
    :active.sync="isActive"
    class="drag-item"
    deselect-cancel=".poster-editor_deactivated-ignore"
    :draggable="draggable"
    @activated="activated"
    @deactivated="deactivated"
    @dragging="onDrag"
    @resizing="onResize"
    @rotating="onRotate"
    @dragstop="onDragStop"
    @rotatestop="onRotateStop"
    @resizestop="onResizeStop"
  >
    <component
      :is="item.componentName"
      ref="widget"
      :item="item"
      :is-active="isActive"
      v-on="$listeners"
      @draggableChange="draggable = $event"
    />
  </vue-draggable-resizable>
</template>

<script>
import vueDraggableResizable from 'poster/components/dragable/components/vue-draggable-resizable'
import { Widget } from 'poster/widgetConstructor'
import exportWidgets from '../exportWidgets'

export default {
  components: { vueDraggableResizable, ...exportWidgets },
  mixins: [Widget.superMixin()],
  data() {
    return {
      draggable: true
    }
  }
}
</script>
<style lang="scss" scoped>
.drag-item {
  user-select: none;
  .text-container {
    box-sizing: border-box;
    margin: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    white-space: wrap;
    word-break: break-all;
    &.editing {
      position: relative;
    }
  }
}
</style>
