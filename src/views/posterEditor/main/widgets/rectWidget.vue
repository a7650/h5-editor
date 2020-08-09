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
  >
    <div class="content" :style="rectStyleFilter" />
    <portal v-if="isActive" to="widgetControl">
      <rect-control
        :key="item.id"
        v-bind.sync="rectStyle"
        :drag-info="dragInfo"
        @dragInfoChange="dragInfo = $event"
      />
    </portal>
  </vue-draggable-resizable>
</template>

<script>
import vueDraggableResizable from '@/components/dragable/components/vue-draggable-resizable'
import rectControl from '../../control/widgets/rectControl'
import { RectWidget } from 'poster/widgetHelpers'
// import { mapGetters, mapActions } from 'poster/poster.vuex'
export default {
  components: { vueDraggableResizable, rectControl },
  mixins: [RectWidget.mixin()],
  data() {
    return {
      rectStyle: {
        borderColor: '',
        borderWidth: 0, // px
        borderStyle: '',
        backgroundColor: '#2d51cc',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      }
    }
  },
  computed: {
    rectStyleFilter() {
      return Object.assign({}, this.rectStyle, {
        borderWidth: this.rectStyle.borderWidth + 'px',
        borderTopLeftRadius: this.rectStyle.borderTopLeftRadius + '%',
        borderTopRightRadius: this.rectStyle.borderTopRightRadius + '%',
        borderBottomLeftRadius: this.rectStyle.borderBottomLeftRadius + '%',
        borderBottomRightRadius: this.rectStyle.borderBottomRightRadius + '%'
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
    width: 100%;
    height: 100%;
  }
}
</style>
