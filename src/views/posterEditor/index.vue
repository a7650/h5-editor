<template>
  <div class="poster-editor">
    <div class="base">
      <left-side />
      <main-component ref="main" />
      <extend-side-bar />
      <control-component />
    </div>
    <!-- 图层面板 -->
    <transition name="el-zoom-in-center">
      <layer-panel v-if="layerPanelOpened" />
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from './poster.vuex'
import controlComponent from './control/index'
import mainComponent from './main/index'
import leftSide from './leftSide/index'
import extendSideBar from './extendSideBar'
import layerPanel from './extendSideBar/layerPanel'
import { getCopyData } from './widgetConstructor/helpers/commandStrat'

const DELETE_KEY = 8
const COPY_KEY = 67
const PASTE_KEY = 86
const LAYER_PANEL_KEY = 76
const REFERENCE_LINE_KEY = 72
export default {
  components: {
    controlComponent,
    mainComponent,
    leftSide,
    extendSideBar,
    layerPanel
  },
  computed: {
    ...mapState([
      'posterItems',
      'layerPanelOpened',
      'activeItems',
      'copiedWidgets',
      'referenceLineOpened'
    ]),
    ...mapGetters(['activeItemIds'])
  },
  mounted() {
    document.addEventListener('keydown', this.keydownHandle)
    this.body = document.body
    this.mainPanelRef = this.$refs.main.$refs.mainPanel
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownHandle)
  },
  methods: {
    ...mapActions([
      'replacePosterItems',
      'pasteWidget',
      'copyWidget',
      'setLayerPanel',
      'setReferenceLineVisible'
    ]),
    keydownHandle(e) {
      if (e.target !== this.body) {
        return
      }
      const keyCode = e.keyCode
      console.log(keyCode)
      if (keyCode === DELETE_KEY && this.activeItemIds.length > 0) {
        // 删除
        this.replacePosterItems(
          this.posterItems.filter(
            (item) => !this.activeItemIds.includes(item.id)
          )
        )
      } else if (keyCode === PASTE_KEY && e.ctrlKey && this.copiedWidgets) {
        // 粘贴
        this.pasteWidget()
      } else if (
        keyCode === COPY_KEY &&
        e.ctrlKey &&
        this.activeItemIds.length > 0
      ) {
        // 复制
        const copiedWidgets = []
        const widgetRefs = this.mainPanelRef.$refs
        this.activeItemIds.forEach((itemId) => {
          const widgetRef = widgetRefs[itemId][0]
          copiedWidgets.push(getCopyData(widgetRef.item, widgetRef._self))
        })
        this.copyWidget(copiedWidgets)
      } else if (keyCode === LAYER_PANEL_KEY && e.ctrlKey) {
        e.preventDefault()
        this.setLayerPanel(!this.layerPanelOpened)
      } else if (keyCode === REFERENCE_LINE_KEY && e.ctrlKey) {
        e.preventDefault()
        this.setReferenceLineVisible(!this.referenceLineOpened)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.poster-editor {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: fixed;
  .base {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
  }
  .left-side {
    height: 100%;
  }
  .poster-editor-main {
    flex: 1;
    height: 100%;
    box-sizing: border-box;
  }
  .extend-side-bar {
    width: 50px;
    height: 100%;
    border-left: 1px solid $colorBorder;
  }
  .poster-editor-control {
    width: 200px;
    height: 100%;
    box-sizing: border-box;
    border-left: 1px solid $colorBorder;
  }
}
</style>
