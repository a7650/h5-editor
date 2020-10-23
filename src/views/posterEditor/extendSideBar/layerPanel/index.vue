<template>
  <div id="layer-panel" class="layer-panel poster-editor_deactivated-ignore">
    <div v-drag:#layer-panel class="header">
      <div class="title">图层面板</div>
      <i class="el-icon-close" @click="close" />
    </div>
    <div class="content">
      <el-scrollbar
        ref="scrollContainer"
        :vertical="true"
        class="scroll-container"
      >
        <draggable
          v-model="inPosterItems"
          :options="{ animation: 200 }"
          class="draggable-container"
        >
          <panel-item
            v-for="item in inPosterItems"
            v-show="item.layerPanelVisible"
            :key="item.id"
            :item="item"
            class="item"
            :class="{ selected: activeItemIds.includes(item.id) }"
          />
        </draggable>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'poster/poster.vuex'
import { drag } from 'poster/poster.directives'
import draggable from 'vuedraggable'
import panelItem from './panelItem'

export default {
  components: { draggable, panelItem },
  directives: { drag },
  data() {
    return {}
  },
  computed: {
    ...mapState(['posterItems']),
    ...mapGetters(['activeItemIds']),
    inPosterItems: {
      get() {
        return [...this.posterItems].reverse()
      },
      set(val) {
        this.replacePosterItems([...val].reverse())
      }
    }
  },
  methods: {
    ...mapActions([
      'setLayerPanel',
      'replacePosterItems'
    ]),
    close() {
      this.setLayerPanel(false)
    }
  }
}
</script>
<style lang="scss" scoped>
.layer-panel {
  width: 220px;
  height: 460px;
  background-color: #1d2024;
  position: fixed;
  right: 252px;
  top: 60px;
  box-shadow: 0 0 6px rgba($color: #000000, $alpha: 0.1);
  color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  user-select: none;
  z-index: 1001;
  .header {
    height: 30px;
    display: flex;
    align-items: center;
    line-height: 30px;
    box-sizing: border-box;
    padding-left: 10px;
    .title {
      height: 30px;
      flex: 1;
      cursor: move;
    }
    i {
      cursor: pointer;
      width: 30px;
      text-align: center;
      padding: 10px 0;
    }
  }
  .content {
    width: 100%;
    flex: 1;
    /* overflow-y: scroll; */
    background-color: #1d2024;
    .draggable-container {
      height: 100%;
    }
    .scroll-container {
      height: 100%;
      ::v-deep .el-scrollbar__wrap {
        overflow-x: hidden;
        height: 430px;
      }
    }
  }
  .panel-item.selected {
    background-color: #404955;
    color: #fff;
    border-left-color: #358dd9;
  }
}
</style>
