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
    :class="{ solid: item.isSolid }"
    deselect-cancel=".poster-editor_deactivated-ignore"
    @
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
import { mapGetters, mapActions, mapState } from 'poster/poster.vuex'
import { BackgroundWidget } from 'poster/widgetConstructor'
const baseMenuList = []

export default {
  components: { vueDraggableResizable },
  mixins: [BackgroundWidget.mixin({ baseMenuList })],
  data() {
    return {
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
    this.setDragInfo({
      w: this.canvasSize.width,
      h: this.canvasSize.height,
      x: 0,
      y: 0
    })
    if (this.item.isSolid) {
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
      'selectAllItems'
    ]),
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
      if (!this.item.isSolid) {
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
    setDragInfo(dragInfo) {
      this.dragInfo = Object.assign({}, this.dragInfo, dragInfo)
    },
    onDrag(x, y) {
      this.setDragInfo({ x, y })
    },
    onResize(x, y, w, h) {
      this.setDragInfo({ x, y, w, h })
    },
    onRotate(e) {
      this.setDragInfo({ rotateZ: (e > 0 ? e : 360 + e) % 360 })
    },
    onDragStop() {}
  }
}
</script>
<style lang="scss" scoped>
.drag-item {
  user-select: none;
  &.solid:hover {
    border-color: transparent !important;
  }
}
</style>
