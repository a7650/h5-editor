<template>
  <div class="widget text">
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
      <text-control :key="item.id" :item="item" />
    </portal>
  </div>
</template>

<script>
import { TextWidget } from 'poster/widgetConstructor'
import { clickoutside } from 'poster/poster.directives'
import textControl from 'poster/control/widgets/textControl'
import { mapState, mapActions } from 'poster/poster.vuex'
export default {
  components: { textControl },
  directives: { clickoutside },
  mixins: [TextWidget.widgetMixin()],
  data() {
    return {
      isEditing: false
    }
  },
  computed: {
    ...mapState(['canvasSize']),
    text() {
      return this.wState.text
    },
    textStyleFilter() {
      const textStyle = this.wState.style
      return Object.assign({}, textStyle, {
        fontSize: textStyle.fontSize + 'px',
        padding: textStyle.padding + 'px',
        borderWidth: textStyle.borderWidth + 'px',
        lineHeight: textStyle.lineHeight + '%',
        letterSpacing: textStyle.letterSpacing + 'px'
      })
    }
  },
  watch: {
    isEditing(newVal) {
      this.$emit('draggableChange', !newVal)
    }
  },
  created() {
    if (!this.item.isCopied) {
      this.updateDragInfo({
        w: 160,
        h: 50,
        x: (this.canvasSize.width - 160) / 2,
        y: 200
      })
    }
  },
  methods: {
    ...mapActions(['setWidgetConfig', 'updateWidgetState']),
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
    saveText(text) {
      const ref = text || this.$refs.textContainer
      this.isEditing = false
      this.updateWidgetState({
        keyPath: 'text',
        value: ref.innerText,
        widgetId: this.item.id
      })
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
