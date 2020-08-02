<template>
  <div class="add-text-widget">
    <el-button
      class="add-text"
      size="mini"
      type="primary"
      @click="addText"
    >添加文本</el-button>
  </div>
</template>

<script>
import { mapActions } from 'poster/poster.vuex'
import { TextWidget } from '../../widgetHelpers'
export default {
  data() {
    return {}
  },
  methods: {
    ...mapActions(['addItem']),
    addText() {
      this.addItem(new TextWidget())
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
