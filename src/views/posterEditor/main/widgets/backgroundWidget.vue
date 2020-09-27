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
    :rotatable="false"
    :lock="item.lock"
    :active.sync="isActive"
    class="drag-item"
    :class="{ solid: wState.isSolid }"
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
    <div
      v-if="wState.isSolid"
      class="poster-editor-background"
      :style="{
        backgroundColor: wState.style.backgroundColor,
        width: '100%',
        height: '100%'
      }"
    />
    <img
      v-else
      ref="image"
      :src="wState.src"
      class="qr-code"
      style="width:100%;height:100%"
      ondragstart="return false"
    >
    <!-- <portal v-if="isActive" to="widgetControl">
    </portal> -->
  </vue-draggable-resizable>
</template>

<script>
import vueDraggableResizable from 'poster/components/dragable/components/vue-draggable-resizable'
import { mapGetters, mapActions, mapState } from 'poster/poster.vuex'
import { BackgroundWidget } from 'poster/widgetConstructor'

export default {
  components: { vueDraggableResizable },
  mixins: [BackgroundWidget.widgetMixin()],
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
      draggable: true,
      resizable: true
    }
  },
  computed: {
    ...mapGetters(['activeItemIds']),
    ...mapState(['canvasSize', 'copiedWidgets']),
    dragInfo: {
      get() {
        return this.item.dragInfo
      },
      set(val) {
        this.item.dragInfo = val
      }
    },
    wState() {
      return this.item.wState
    }
  },
  watch: {
    activeItemIds(newVal) {
      if (newVal.length > 0) {
        this.isActive = false
      }
    }
  },
  mounted() {
    this.updateBackgroundDragInfo({
      w: this.canvasSize.width,
      h: this.canvasSize.height,
      x: 0,
      y: 0
    })
    if (this.wState.isSolid) {
      this.resizable = false
      this.draggable = false
    }
  },
  methods: {
    ...mapActions([
      'removeBackground',
      'setBackgroundConfig',
      'pasteWidget',
      'replaceActiveItems',
      'selectAllItems',
      'updateBackgroundDragInfo'
    ]),
    ...mapActions({
      pushHistory: 'history/push'
    }),
    /**
     * @mixin
     */
    executeContextCommand(command) {
      if (command === 'remove') {
        if (!this.item.lock) {
          this.removeBackground(null)
        }
      } else if (command === 'lock') {
        this.setBackgroundConfig((config) => {
          config.lock = true
        })
      } else if (command === 'unlock') {
        this.setBackgroundConfig((config) => {
          config.lock = false
        })
      } else if (command === 'paste') {
        this.pasteWidget()
      } else if (command === 'selectAll') {
        this.selectAllItems()
      }
    },
    /**
     * @mixin
     * @return {MenuItem[]}
     */
    getMenuList() {
      const menuList = [{ label: '全选', command: 'selectAll' }]
      if (this.copiedWidgets) {
        menuList.unshift({ label: '粘贴', command: 'paste' })
      }
      if (!this.wState.isSolid) {
        if (this.item.lock) {
          menuList.unshift({ label: '解除锁定', command: 'unlock' })
        } else {
          menuList.unshift({ label: '锁定', command: 'lock' })
        }
        menuList.push({ label: '删除', command: 'remove' })
      }
      return menuList
    },
    activated() {
      this.isActive = true
      this.replaceActiveItems([])
    },
    deactivated() {
      this.isActive = false
    },
    onDrag(x, y) {
      if (!this.dragging) {
        this.pushHistory()
        this.dragging = true
      }
      this.updateBackgroundDragInfo({ x, y })
    },
    onResize(x, y, w, h) {
      if (!this.resizing) {
        this.pushHistory()
        this.resizing = true
      }
      this.updateBackgroundDragInfo({ x, y, w, h })
    },
    onRotate(e) {
      if (!this.rotating) {
        this.pushHistory()
        this.rotating = true
      }
      this.updateBackgroundDragInfo({ rotateZ: (e > 0 ? e : 360 + e) % 360 })
    },
    onDragStop() {
      this.dragging = false
    },
    onResizeStop() {
      this.resizing = false
    },
    onRotateStop() {
      this.rotating = false
    }
  }
}
</script>
<style lang="scss" scoped>
.drag-item {
  user-select: none;
  &.solid:hover {
    border-color: transparent !important;
    box-shadow: none !important;
  }
}
</style>
