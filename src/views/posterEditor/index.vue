<template>
  <div class="poster-editor">
    <div class="base">
      <left-side />
      <main-component />
      <extend-side-bar />
      <control-component />
    </div>
    <!-- 图层面板 -->
    <layer-panel v-if="layerPanelOpened" />
  </div>
</template>

<script>
import { mapState, mapMutations } from './poster.vuex'
import controlComponent from './control/index'
import mainComponent from './main/index'
import leftSide from './leftSide/index'
import extendSideBar from './extendSideBar'
import layerPanel from './extendSideBar/layerPanel'
export default {
  components: {
    controlComponent,
    mainComponent,
    leftSide,
    extendSideBar,
    layerPanel
  },
  computed: {
    ...mapState(['items', 'layerPanelOpened'])
  },
  methods: {
    ...mapMutations(['ADD_ITEM'])
  }
}
</script>

<style lang="scss" scoped>
.poster-editor {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: fixed;
  .base{
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
    width: 300px;
    height: 100%;
    box-sizing: border-box;
    border-left: 1px solid $colorBorder;
  }
}
</style>
