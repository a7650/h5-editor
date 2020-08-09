<template>
  <div
    class="main-panel"
    :style="{
      width: canvasSize.width + 'px',
      height: canvasSize.height + 'px'
    }"
    @contextmenu.prevent=""
  >
    <background-widget
      v-if="background"
      :key="background.id"
      :item="background"
      @openContextmenu="openContextmenu"
    />
    <component
      :is="item.componentName"
      v-for="item in posterItems"
      v-show="item.visible"
      :ref="item.id"
      :key="item.id"
      :item="item"
      @openContextmenu="openContextmenu"
    />
    <custom-contextmenu
      v-if="contextmenuVisible"
      v-clickoutside="closeContextmenu"
      v-bind="contextmenuPosition"
      :menu-list="menuList"
      @executeCommand="executeContextCommand"
    />
  </div>
</template>

<script>
import imageWidget from './widgets/imageWidget'
import backgroundWidget from './widgets/backgroundWidget'
import textWidget from './widgets/textWidget'
import drawRectWidget from './widgets/drawRectWidget'
import rectWidget from './widgets/rectWidget'
import { mapState, mapMutations } from '../poster.vuex'
import customContextmenu from '@/components/customContextmenu'
import { clickoutside } from 'poster/poster.directives'

export default {
  components: {
    customContextmenu,
    imageWidget,
    backgroundWidget,
    textWidget,
    drawRectWidget,
    rectWidget
  },
  directives: { clickoutside },
  data() {
    return {
      contextmenuVisible: false,
      contextmenuPosition: { x: 0, y: 0 },
      menuList: []
    }
  },
  computed: {
    ...mapState(['posterItems', 'canvasSize', 'background'])
  },
  methods: {
    ...mapMutations(['SET_CANVAS_SIZE']),
    openContextmenu({ x, y, menuList, vm }) {
      this.contextmenuPosition.x = x
      this.contextmenuPosition.y = y
      this.menuList = menuList
      this._currentContextMenuWidgetVm = vm
      this.contextmenuVisible = true
    },
    closeContextmenu() {
      this.contextmenuVisible = false
    },
    // 执行右键命令
    executeContextCommand(commandItem) {
      this.closeContextmenu()
      const vm = this._currentContextMenuWidgetVm
      if (vm && vm.executeContextCommand) {
        vm._executeContextCommand(commandItem)
      }
    }
  },
  created() {
    this.SET_CANVAS_SIZE({ width: 338, height: 600 })
  }
}
</script>
<style lang="scss" scoped>
.main-panel {
  background-color: #fff;
  position: absolute;
  margin-top: 50px;
  left: 50%;
  margin-left: -169px;
  user-select: none;
  box-shadow: 0 0 6px rgba($color: #000000, $alpha: 0.1);
  .poster-item-container {
    /* position: absolute;
    top: 0; */
  }
}
</style>
