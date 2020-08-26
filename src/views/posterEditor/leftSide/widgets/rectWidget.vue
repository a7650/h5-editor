<template>
  <div class="add-text-widget">
    <el-button
      class="add-text"
      size="mini"
      type="plain"
      @click="addRect"
    >添加矩形</el-button>
  </div>
</template>

<script>
import { mapActions } from 'poster/poster.vuex'
import { DrawRectWidget } from '../../widgetConstructor'
export default {
  data() {
    return {
      recommendList: []
    }
  },
  methods: {
    ...mapActions(['addAssistWidget']),
    addRect() {
      this.addAssistWidget(new DrawRectWidget())
    }
  }
}
</script>
<style lang="scss" scoped>
.add-text-widget {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  .add-text {
    width: 100%;
  }
}
</style>
