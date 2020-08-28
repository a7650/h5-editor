<template>
  <div class="undo">
    <el-form size="small">
      <el-form-item label="撤销/恢复操作步数">
        <el-input v-model.number="maxHistoryStackLength" type="number" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      maxHistoryStackLength: 30
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.el-input{
    width: 200px;
}
</style>
