<template>
  <div class="activity-form">
    <input v-model="formName" class="form-name">
    <!-- <portal v-if="isActive" :to="$data.$controlTarget">
      <widget-control :item="item" />
    </portal> -->
  </div>
</template>

<script>
import PluginA from './constructor'
// import widgetControl from './widgetControl'
// import { pluginWrap } from '../helpers'
export default {
  // components: { widgetControl: pluginWrap(widgetControl) },
  mixins: [PluginA.widgetMixin()],
  props: ['pluginHelpers'],
  data() {
    return {}
  },
  computed: {
    formName: {
      get() {
        return this.wState.formName
      },
      set(val) {
        this.pluginHelpers.updateWidgetState('formName', val)
      }
    }
  },
  methods: {
    executeContextCommand(command) {
      this.$message.success('插件测试命令')
    },
    getMenuList() {
      return [
        {
          label: '插件测试',
          command: 'test'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-form {
  width: 100%;
  height: 100%;
  color: #000;
  position: relative;
  z-index: 2;
  display: flex;
  box-sizing: border-box;
  padding: 10px;
  .form-name {
    width: 70%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    background-color: transparent;
    border: 1px solid $colorBorder;
    margin: 0 auto;
    &:focus{
      border-color: #000;
    }
  }
}
</style>
