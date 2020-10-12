<template>
  <div class="left-side_activity-form">
    <el-button class="add-form" size="small" @click="add">添加表单</el-button>
  </div>
</template>

<script>
import ActivityFormWidget from './constructor'
export default {
  props: ['pluginHelpers'],
  methods: {
    add() {
      const { width } = this.pluginHelpers.getCanvasSize()
      this.pluginHelpers.addWidget(
        new ActivityFormWidget({
          dragInfo: {
            w: width
          }
        })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.left-side_activity-form {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  .add-form {
    width: 100%;
  }
}
</style>
