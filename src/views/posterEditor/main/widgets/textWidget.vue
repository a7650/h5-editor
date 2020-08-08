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
    :draggable="!isEditing"
    @activated="activated"
    @deactivated="deactivated"
    @dragging="onDrag"
    @resizing="onResize"
    @rotating="onRotate"
    @dblclick.native="openEditing"
  >
    <div
      v-if="!isEditing"
      class="text-container"
      contenteditable="false"
      :style="textStyleFilter"
    >
      {{ text }}
    </div>
    <div
      v-else
      ref="textContainer"
      v-clickoutside="saveText"
      class="text-container editing"
      contenteditable="true"
      :style="textStyleFilter"
    >
      {{ text }}
    </div>
    <portal v-if="isActive" to="widgetControl">
      <text-control
        :key="item.id"
        :drag-info="dragInfo"
        v-bind.sync="textStyle"
        @dragInfoChange="dragInfo = $event"
      />
    </portal>
  </vue-draggable-resizable>
</template>

<script>
import vueDraggableResizable from '@/components/dragable/components/vue-draggable-resizable'
import { TextWidget } from 'poster/widgetHelpers'
import { clickoutside } from 'poster/poster.directives'
import textControl from 'poster/control/widgets/textControl'
import { mapState, mapActions } from 'poster/poster.vuex'
export default {
  components: { vueDraggableResizable, textControl },
  mixins: [TextWidget.mixin()],
  directives: { clickoutside },
  data() {
    return {
      isEditing: false,
      text: '',
      textStyle: {
        color: '#000',
        textAlign: 'center',
        fontSize: 14, // px
        padding: 0, // px
        borderColor: '#000',
        borderWidth: 0, // px
        borderStyle: 'solid',
        lineHeight: 100, // %
        letterSpacing: 0, // %
        backgroundColor: ''
      }
    }
  },
  computed: {
    ...mapState(['canvasSize']),
    textStyleFilter() {
      return Object.assign({}, this.textStyle, {
        fontSize: this.textStyle.fontSize + 'px',
        padding: this.textStyle.padding + 'px',
        borderWidth: this.textStyle.borderWidth + 'px',
        lineHeight: this.textStyle.lineHeight + '%',
        letterSpacing: this.textStyle.letterSpacing + 'px'
      })
    }
  },
  created() {
    if (!this.item.isCopied) {
      this.dragInfo.w = 160
      this.dragInfo.h = 50
      this.dragInfo.x = (this.canvasSize.width - 160) / 2
      this.dragInfo.y = 200
      this.text = this.item.text
    }
  },
  methods: {
    ...mapActions(['setWidgetConfig']),
    getMenuList() {
      return []
    },
    openEditing() {
      this.isEditing = true
      this.$nextTick(() => {
        const ref = this.$refs.textContainer
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(ref)
        selection.removeAllRanges()
        selection.addRange(range)
      })
    },
    saveText() {
      const ref = this.$refs.textContainer
      this.text = ref.innerText
      this.isEditing = false
      this.setWidgetConfig({ item: this.item, cb: (i) => (i.text = this.text) })
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
