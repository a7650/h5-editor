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
import { mapGetters, mapActions, mapState, mapMutations } from 'poster/poster.vuex'
import { BackgroundWidget } from 'poster/widgetHelpers'

const baseMenuList = []

export default {
  components: { vueDraggableResizable, imageControl },
  mixins: [BackgroundWidget.mixin({ baseMenuList })],
  data() {
    return {
      draggable: true,
      resizable: true
    }
  },
  computed: {
    ...mapGetters(['activeItemIds']),
    ...mapState(['canvasSize', 'copiedWidget'])
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
  },
  methods: {
    ...mapActions(['removeBackground', 'setBackgroundConfig']),
    ...mapMutations(['PASTE_WIDGET']),
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
        this.PASTE_WIDGET()
      }
    },
    /**
     * @mixin
     * @return {MenuItem[]}
     */
    getMenuList() {
      const menuList = []
      if (this.copiedWidget) {
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
