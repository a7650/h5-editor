<template>
  <div class="undo">
    <el-form size="small">
      <el-form-item label="撤销/恢复操作步数">
        <el-input v-model.number="maxHistoryStackLength" type="number" />
      </el-form-item>
    </el-form>
    <!-- title="注意" -->
    <el-alert
      type="info"
      :closable="false"
      description="若编辑器卡顿，可尝试调低该属性"
      show-icon
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'poster/poster.vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      maxHistory: state => state.history.maxHistoryStackLength
    }),
    maxHistoryStackLength: {
      get() {
        return this.maxHistory
      },
      set(val) {
        this.setMaxHistory(val)
      }
    }
  },
  methods: {
    ...mapActions({
      setMaxHistory: 'history/setMaxHistory'
    })
  }
}
</script>
<style lang="scss" scoped>
.el-input {
  width: 200px;
}
</style>
