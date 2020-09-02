<template>
  <div class="setting-center">
    <el-tabs v-model="activeTab" tab-position="left" style="height: 300px;">
      <el-tab-pane label="数据备份" name="dataBackup">
        <data-backup />
      </el-tab-pane>
      <el-tab-pane label="撤销设置" name="undo">
        <undo />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import dataBackup from './dataBackup'
import undo from './undo'
export default {
  components: { dataBackup, undo },
  data() {
    return {
      activeTab: 'dataBackup'
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
