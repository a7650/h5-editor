<template>
  <div class="plugin-a">
    <button v-for="item in wState.buttonCount" :key="item">{{ item }}</button>
    <!-- control-panel-portal 是组件控制面板的portal组件（页面最右侧那栏） -->
    <!-- control-panel是usePlugin的时候传入的control-panel组件 -->
    <!-- control-panel要传入props :item="item" ，当然也可以不传，只不过control-panel里可以用commonMixin，里面需要这个item-->
    <!-- control-panel放在portal里是因为这样可以方便地定制一些组件，也可以方便的使画布上的widget和控制面板通信 -->
    <control-panel-portal>
      <control-panel :item="item" />
    </control-panel-portal>
  </div>
</template>

<script>
export default {
  data() {
    return {}
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
.plugin-a {
  width: 100%;
  height: 100%;
  color: #000;
  /* position: relative; */
  /* z-index: 2; */
  display: flex;
  button {
    flex: 1;
    height: 100%;
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
