<template>
  <div class="bottom-bar">
    <div class="canvas-size">
      画布大小:
      <span>{{ `宽${canvasSize.width}px` }}</span>
      <span>{{ `高${canvasSize.height}px` }}</span>
      <el-popover
        placement="top"
        title="修改画布大小"
        width="200"
        trigger="click"
        transition="el-zoom-in-center"
      >
        <change-size />
        <i
          slot="reference"
          class="el-icon-paperclip change-size"
          title="修改画布大小"
        />
      </el-popover>
    </div>
    <div class="widget-count">
      <span>{{ `元素数量：${posterItemIds.length}` }}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'poster/poster.vuex'
import changeSize from './changeSize'
export default {
  components: { changeSize },
  data() {
    return {}
  },
  computed: {
    ...mapState(['canvasSize']),
    ...mapGetters(['posterItemIds'])
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.bottom-bar {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 30px;
  border-top: 1px solid rgb(230, 230, 230);
  box-sizing: border-box;
  padding: 0 10px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 6px rgba($color: #000000, $alpha: 0.04);
  z-index: 101;
  background-color: #fff;
  font-size: 12px;
  color: $colorTextL;
  justify-content: space-between;
  .canvas-size {
    span {
      padding-left: 2px;
    }
    .change-size {
      font-size: 16px;
      margin-left: 4px;
      cursor: pointer;
      &:hover {
        color: #000;
      }
    }
  }
  .widget-count {
  }
}
</style>
