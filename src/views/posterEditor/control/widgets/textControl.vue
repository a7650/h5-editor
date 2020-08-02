<template>
  <div class="text-control">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="text">
        <template #title>
          <div class="header">
            文字
          </div>
        </template>
        <div class="setting-content">
          文字颜色
          <el-color-picker v-model="inTextColor" />
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
    },
    textColor: {
      type: String,
      default: '#000'
    }
  },
  data() {
    return {
      activeNames: ['text', 'position'],
      inDragInfo: {}
    }
  },
  computed: {
    inTextColor: {
      get() {
        return this.textColor
      },
      set(val) {
        this.$emit('update:textColor', val)
      }
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
  }
}
</script>
<style lang="scss" scoped>
.text-control {
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
