<template>
  <div class="setting-center">
    <el-tabs v-model="activeTab" tab-position="left" style="height: 300px;">
      <el-tab-pane label="撤销设置" name="undo">
        <undo />
      </el-tab-pane>
      <el-tab-pane v-if="useBackup" label="数据备份" name="dataBackup">
        <data-backup />
      </el-tab-pane>
      <el-tab-pane label="快捷键参考" name="shortcut">
        <shortcut />
      </el-tab-pane>
      <!-- <el-tab-pane label="操作设置" name="handleSetting">
        <handle-setting />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import dataBackup from './dataBackup'
import undo from './undo'
import shortcut from './shortcut'
// import handleSetting from './handleSetting'
export default {
  components: { dataBackup, undo /** handleSetting*/, shortcut },
  data() {
    return {
      activeTab: 'undo'
    }
  },
  computed: {
    useBackup() {
      return this.$store.state.poster.backup.useBackup
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.setting-center {
  user-select: none;
}
</style>
