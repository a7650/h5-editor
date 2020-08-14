<template>
  <div class="bottom-bar">
    <div class="canvas-size">
      画布大小:
      <span>{{ `宽${canvasSize.width}px` }}</span>
      <span>{{ `高${canvasSize.height}px` }}</span>
    </div>
    <div class="widget-count">
      <span>{{ `元素数量：${posterItemIds.length}` }}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'poster/poster.vuex'
export default {
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
  .canvas-size{
    span{
      padding-left: 2px;
    }
  }
  .widget-count{

  }
}
</style>
