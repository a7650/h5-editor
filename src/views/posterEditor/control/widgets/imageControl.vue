<template>
  <div id="image-control" class="image-control">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="图片" name="image">
        图片
      </el-collapse-item>
      <el-collapse-item title="位置" name="position">
        <div class="setting-item">
          <div class="title">
            宽度
          </div>
          <div class="content">
            {{ dragInfo.w }}
          </div>
        </div>
        <div class="setting-item">
          <div class="title">
            高度
          </div>
          <div class="content">
            {{ dragInfo.h }}
          </div>
        </div>
        <div class="setting-item">
          <div class="title">
            左侧距离
          </div>
          <div class="content">
            {{ dragInfo.x }}
          </div>
        </div>
        <div class="setting-item">
          <div class="title">
            顶部距离
          </div>
          <div class="content">
            {{ dragInfo.y }}
          </div>
        </div>
        <div class="setting-item">
          <div class="title">
            旋转角度
          </div>
          <div class="content">
            {{ dragInfo.rotateZ }}
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
      activeNames: []
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.image-control{
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  .setting-item{
    background-color: rgb(161, 161, 161);
    .title{

    }
    .content{

    }
  }
}
</style>
