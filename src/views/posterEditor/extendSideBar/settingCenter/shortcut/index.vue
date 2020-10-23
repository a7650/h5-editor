<template>
  <div class="shortcut">
    <section>
      <div class="title">基础</div>
      <div class="content">
        <ul>
          <li><b>ctrl + z</b><span>撤销操作</span></li>
          <li><b>ctrl + shift + z</b><span>恢复操作</span></li>
          <li><b>ctrl + L</b><span>打开/关闭图层面板</span></li>
          <li><b>ctrl + h</b><span>打开/关闭参考线</span></li>
          <li><b>ctrl + s</b><span>备份数据</span></li>
        </ul>
      </div>
    </section>
    <section>
      <div class="title">组件操作相关</div>
      <div class="content">
        <ul>
          <li><b>ctrl + c</b><span>复制组件</span></li>
          <li><b>ctrl + v</b><span>粘贴组件</span></li>
          <li><b>ctrl + 点击组件（或图层面板中的组件）</b><span>多选</span></li>
          <li><b>ctrl + 拖动组件</b><span>快速复制组件</span></li>
          <li><b>拖动时 + alt</b><span>关闭校准参考线以及自动吸附</span></li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
section {
  margin-bottom: 20px;
}
.title {
  font-size: 16px;
  margin-bottom: 6px;
  font-weight: bold;
  color: #000;
}
.content {
  font-size: 14px;
  color: $colorText;
  li {
      margin-bottom: 10px;
    b {
        padding-right: 10px;
    }
    span {
    }
  }
}
</style>
