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
    <!-- 组件容器 -->
    <widget-container
      v-for="item in posterItems"
      v-show="item.visible"
      :key="item.id"
      :item="item"
      @openContextmenu="openContextmenu"
    />
    <!-- 辅助组件 -->
    <component
      :is="item.componentName"
      v-for="item in assistWidgets"
      v-show="item.visible"
      :key="item.id"
      :item="item"
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
import { mapState, mapMutations } from '../poster.vuex'
import customContextmenu from '@/components/customContextmenu'
import { clickoutside } from 'poster/poster.directives'
import widgetContainer from './widgets/widgetContainer'
import backgroundWidget from './widgets/backgroundWidget'
import drawRectWidget from './assistWidgets/drawRectWidget'
export default {
  components: {
    customContextmenu,
    widgetContainer,
    backgroundWidget,
    drawRectWidget
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
    ...mapState(['posterItems', 'canvasSize', 'background', 'assistWidgets'])
  },
  methods: {
    ...mapMutations(['SET_CANVAS_SIZE']),
    openContextmenu({ x, y, menuList, vm }) {
      this.contextmenuPosition.x = x
      this.contextmenuPosition.y = y
      this.menuList = menuList
      this._currentContextmenuWidgetVm = vm
      this.contextmenuVisible = true
    },
    closeContextmenu() {
      this.contextmenuVisible = false
    },
    // 执行右键命令
    executeContextCommand(commandItem) {
      this.closeContextmenu()
      const vm = this._currentContextmenuWidgetVm
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
  .custom-contextmenu {
    z-index: 999;
  }
}
</style>
