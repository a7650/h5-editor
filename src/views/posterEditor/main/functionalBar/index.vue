<template>
  <div class="functional-bar">
    <ul>
      <li @click="savePage">
        <i class="el-icon-upload" />
        <span>
          <el-badge is-dot :hidden="!isUnsavedState">
            {{ savePageLoading ? "正在保存" : "保存页面" }}
          </el-badge>
        </span>
      </li>
      <li @click="closeEditor">
        <i class="el-icon-circle-close" />
        <span>关闭编辑器</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'poster/poster.vuex'
export default {
  data() {
    return {
      savePageLoading: false
    }
  },
  computed: {
    ...mapState(['isUnsavedState', 'posterItems'])
  },
  methods: {
    ...mapActions(['saveActivityPageConfig']),
    closeEditor() {
      this.$router.back()
    },
    savePage() {
      if (this.savePageLoading) return
      if (this.posterItems.length === 0) {
        this.$message.error('当前画布中未添加任何元素，请添加后再提交')
        return
      }
      this.savePageLoading = true
      this.saveActivityPageConfig().finally(() => {
        this.savePageLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.functional-bar {
  background-color: #1d2024;
  border-radius: 2px;
  position: absolute;
  top: 26px;
  right: 4px;
  padding: 4px 10px;
  box-shadow: 0 0 6px rgba($color: #000000, $alpha: 0.2);
  z-index: 999;
  ul {
    /* padding: 2px 0; */
    /* height: 22px; */
  }
  li {
    user-select: none;
    cursor: pointer;
    color: #9099a4;
    float: left;
    display: flex;
    align-items: center;
    transition: 0.2s;
    font-size: 14px;
    &:hover {
      color: #fff;
    }
    &:not(:first-child) {
      margin-left: 14px;
    }
    i {
      font-size: 16px;
      padding-right: 2px;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>
