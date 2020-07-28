<template>
  <div class="extend-side-bar">
    <ul class="list">
      <el-tooltip effect="dark" content="图层" placement="left">
        <li class="item" @click="openLayer">
          <i class="el-icon-copy-document" />
        </li>
      </el-tooltip>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    // 打开图层面板
    openLayer() {
      this.$store.commit('poster/SET_LAYER_PANEL', true)
    }
  }
}
</script>
<style lang="scss" scoped>
.list {
  width: 100%;
  height: 100%;
  .item {
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
    transition: 0.2s;
    i {
      font-size: 24px;
    }
    &:hover {
      background-color: $colorTheme;
      color: #fff;
    }
  }
}
</style>
