<template>
  <div class="left-side">
    <ul class="widget-list">
      <li v-for="item in widgets" :key="item.type" @click="current = item">
        <el-tooltip
          class="widget-item"
          :class="{ active: current.type === item.type }"
          effect="dark"
          :content="item.name"
          placement="right"
        >
          <i :class="item.icon" />
        </el-tooltip>
      </li>
    </ul>
    <div v-if="current" class="widget-container">
      <component :is="current.component" />
    </div>
  </div>
</template>

<script>
import imageWidget from './widgets/imageWidget'
export default {
  components: { imageWidget },
  data() {
    return {
      current: null,
      widgets: [
        {
          type: 'image',
          component: 'image-widget',
          name: '图片',
          icon: 'el-icon-picture'
        }
      ]
    }
  },
  created() {
    this.current = this.widgets[0]
  }
}
</script>

<style lang="scss" scoped>
.left-side {
  background-color: #fff;
  box-sizing: border-box;
  border-right: 1px solid rgb(224, 224, 224);
  display: flex;
  .widget-list {
    width: 60px;
    height: 100%;
    border-right: 1px solid rgb(224, 224, 224);
    .widget-item {
      width: 60px;
      height: 60px;
      cursor: pointer;
      text-align: center;
      line-height: 60px;
      font-size: 24px;
      transition: 0.4s;
      &:hover,
      &.active {
        background-color: $colorTheme;
        color: #fff;
      }
    }
  }
  .widget-container {
    width: 200px;
    height: 100%;
  }
}
</style>
