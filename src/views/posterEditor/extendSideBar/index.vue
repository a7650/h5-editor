<template>
  <div class="extend-side-bar">
    <div class="list">
      <el-tooltip
        effect="dark"
        content="撤销 ctrl+z"
        placement="left"
        transition="el-zoom-in-center"
      >
        <div class="item" :class="{ disabled: !couldUndo }" @click="undo">
          <i class="icon-undo" />
        </div>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="恢复 ctrl+shift+z"
        placement="left"
        transition="el-zoom-in-center"
      >
        <div
          style="transform:rotateY(180deg)"
          class="item"
          :class="{ disabled: !couldRedo }"
          @click="redo"
        >
          <i class="icon-undo" />
        </div>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="图层面板 ctrl+L"
        placement="left"
        transition="el-zoom-in-center"
      >
        <div
          class="item"
          :class="{ active: layerPanelOpened }"
          @click="openLayer"
        >
          <i class="icon-layer" />
        </div>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="参考线 ctrl+h"
        placement="left"
        transition="el-zoom-in-center"
      >
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
      <el-tooltip
        v-if="useBackup"
        effect="dark"
        content="数据备份 ctrl+s"
        placement="left"
        transition="el-zoom-in-center"
      >
        <div class="item" @click="openSettingCenter('dataBackup')">
          <i class="el-icon-document-copy" />
        </div>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="生成H5代码"
        placement="left"
        transition="el-zoom-in-center"
      >
        <div class="item" @click="exportH5">
          <i class="icon-h5" />
        </div>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="生成海报"
        placement="left"
        transition="el-zoom-in-center"
      >
        <div class="item" @click="exportPoster">
          <i class="icon-poster" />
        </div>
      </el-tooltip>
      <el-tooltip
        effect="dark"
        content="编辑器设置"
        placement="left"
        transition="el-zoom-in-center"
      >
        <div class="item" @click="openSettingCenter">
          <i class="el-icon-set-up" />
        </div>
      </el-tooltip>
      <el-tooltip
        v-for="item in plugins"
        :key="item.name"
        effect="dark"
        :content="item.name"
        placement="left"
        transition="el-zoom-in-center"
      >
        <div class="item">
          <i :class="item.icon" />
        </div>
      </el-tooltip>
    </div>

    <el-dialog
      :visible.sync="settingCenterVisible"
      title="设置中心"
      width="600px"
      append-to-body
      transition="el-zoom-in-center"
    >
      <setting-center ref="settingCenter" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'poster/poster.vuex'
import referenceLine from './referenceLine'
import settingCenter from './settingCenter'
import Vue from 'vue'
import ExportService from 'poster/service/exportService'
import { pluginMap, pluginWrap } from '../plugins'
const pluginComponents = {}
const plugins = []
for (const [pluginName, options] of Object.entries(pluginMap.extendSideBar)) {
  const { component } = options
  pluginComponents[pluginName] = pluginWrap(component)
  plugins.push(options)
}

export default {
  components: { referenceLine, settingCenter },
  data() {
    return {
      settingCenterVisible: false
    }
  },
  computed: {
    ...mapState({
      layerPanelOpened: 'layerPanelOpened',
      couldRedo: (state) => state.history.nextStack.length > 0,
      couldUndo: (state) => state.history.preStack.length > 0,
      useBackup: (state) => state.backup.useBackup
    }),
    plugins() {
      return Object.freeze(plugins)
    }
  },
  methods: {
    ...mapActions({
      undo: 'history/undo',
      redo: 'history/redo'
    }),
    exportH5() {
      ExportService.exportH5()
    },
    exportPoster() {},
    // 打开图层面板
    openLayer() {
      this.$store.dispatch('poster/setLayerPanel', !this.layerPanelOpened)
    },
    openSettingCenter(tab) {
      this.settingCenterVisible = true
      this.$nextTick(() => {
        if (typeof tab === 'string' && this.$refs.settingCenter) {
          Vue.set(this.$refs.settingCenter, 'activeTab', tab)
        }
      })
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
      &.icon-undo {
        font-size: 14px;
      }
      &.el-icon-set-up {
        font-size: 22px;
      }
    }
    &:hover,
    &.active {
      color: $colorTheme;
    }
    &.disabled {
      color: #999;
    }
  }
}
</style>
