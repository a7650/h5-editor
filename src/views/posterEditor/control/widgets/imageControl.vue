<template>
  <div id="image-control" class="image-control">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="image">
        <template #title>
          <div class="header">
            图片
          </div>
        </template>
        <div class="setting-content">
          #tupian
        </div>
      </el-collapse-item>
      <el-collapse-item name="position">
        <template #title>
          <div class="header">
            位置
          </div>
        </template>
        <div class="setting-content">
          <div class="setting-item">
            <div class="title">
              宽度
            </div>
            <div class="content">
              <input v-model.number="inDragInfo.w" type="number">
            </div>
          </div>
          <div class="setting-item">
            <div class="title">
              高度
            </div>
            <div class="content">
              <input v-model.number="inDragInfo.h" type="number">
            </div>
          </div>
          <div class="setting-item">
            <div class="title">
              左侧距离
            </div>
            <div class="content">
              <input v-model.number="inDragInfo.x" type="number">
            </div>
          </div>
          <div class="setting-item">
            <div class="title">
              顶部距离
            </div>
            <div class="content">
              <input v-model.number="inDragInfo.y" type="number">
            </div>
          </div>
          <div class="setting-item">
            <div class="title">
              旋转角度
            </div>
            <div class="content">
              <input v-model.number="inDragInfo.rotateZ" type="number">
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  props: {
    dragInfo: {
      type: Object,
      default() {
        return {
          w: 0,
          h: 0,
          x: 0,
          y: 0,
          rotateZ: 0
        }
      }
    }
  },
  data() {
    return {
      activeNames: ['image', 'position'],
      inDragInfo: {}
    }
  },
  watch: {
    inDragInfo: {
      handler() {
        this.$emit('dragInfoChange', this.inDragInfo)
      },
      deep: true
    }
  },
  created() {
    this.inDragInfo = this.$deepCopy(this.dragInfo)
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.image-control {
  width: 100%;
  .header {
    box-sizing: border-box;
    padding: 0 20px;
  }
  .setting-content {
    background-color: rgb(238, 238, 238);
    box-sizing: border-box;
    padding: 0 20px 10px;
  }
  .setting-item {
    .title {
    }
    .content {
      input {
        width: 100%;
        height: 34px;
        border: 1px solid rgb(117, 117, 117);
        box-sizing: border-box;
        padding: 0 4px;
      }
    }
  }
}
</style>
