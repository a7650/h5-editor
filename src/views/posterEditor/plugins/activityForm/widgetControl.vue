<template>
  <div class="plugin-a">
    <el-form>
      <el-form-item label="按钮数量">
        <el-input v-model="buttonCount" type="number" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { controlMixin } from '../helpers'
export default {
  mixins: [controlMixin],
  props: ['pluginHelpers'],
  computed: {
    buttonCount: {
      get() {
        return this.wState.buttonCount
      },
      set(val) {
        this.pluginHelpers.updateWidgetState({
          keyPath: 'buttonCount',
          value: parseInt(val),
          widgetId: this.item.id
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.plugin-a {
  box-sizing: border-box;
  padding: 10px;
}
</style>
