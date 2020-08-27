<template>
  <div class="setting-center">
    <el-tabs tab-position="left" style="height: 300px;">
      <el-tab-pane label="数据备份">
        <data-backup />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import dataBackup from './dataBackup'
export default {
  components: { dataBackup },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.setting-center {
  user-select: none;
}
</style>
