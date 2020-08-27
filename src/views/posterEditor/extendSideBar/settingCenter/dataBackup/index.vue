<template>
  <div class="data-backup">
    <el-form size="small">
      <el-form-item label="打开自动备份">
        <el-checkbox v-model="autoSave" />
      </el-form-item>
      <el-form-item label="自动备份时间间隔">
        <el-select
          v-model="autoSaveDivision"
          placeholder="请选择"
          :disabled="!autoSave"
        >
          <el-option
            v-for="item in autoSaveDivisionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备份记录">
        <span>{{ `上次备份：2020-08-27 13:49${1}` }}</span>
        <span class="recover">恢复数据</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      autoSave: true,
      autoSaveDivision: 1000 * 60 * 10,
      autoSaveDivisionOptions: [
        {
          label: '5分钟',
          value: 1000 * 60 * 5
        },
        {
          label: '10分钟',
          value: 1000 * 60 * 10
        },
        {
          label: '20分钟',
          value: 1000 * 60 * 20
        },
        {
          label: '30分钟',
          value: 1000 * 60 * 30
        }
      ]
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.data-backup {
  .recover{
    margin-left: 10px;
    color: $colorTheme;
    cursor: pointer;
  }
}
</style>
