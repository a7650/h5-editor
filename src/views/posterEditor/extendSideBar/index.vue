<template>
  <div class="extend-side-bar">
    <div class="list">
      <el-tooltip effect="dark" content="图层面板" placement="left">
        <div
          class="item"
          :class="{ active: layerPanelOpened }"
          @click="openLayer"
        >
          <i class="icon-layer" />
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="参考线" placement="left">
        <el-popover
          placement="left"
          title="参考线"
          width="200"
          trigger="click"
          transition="el-zoom-in-center"
        >
          <reference-line />
          <div slot="reference" class="item">
            <i class="icon-grid" />
          </div>
        </el-popover>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState } from 'poster/poster.vuex'
import referenceLine from './referenceLine'
export default {
  components: { referenceLine },
  data() {
    return {}
  },
  computed: {
    ...mapState(['layerPanelOpened'])
  },
  methods: {
    // 打开图层面板
    openLayer() {
      this.$store.commit('poster/SET_LAYER_PANEL', !this.layerPanelOpened)
    }
  }
}
</script>
<style lang="scss" scoped>
.list {
  width: 100%;
  height: 100%;
  .item {
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
    /* transition: 0.2s; */
    border-radius: 4px;
    i {
      font-size: 18px;
    }
    &:hover,
    &.active {
      background-color: $colorTheme;
      color: #fff;
    }
  }
}
</style>
