<template>
  <div class="change-size">
    <div class="item" title="无法修改宽度">
      <span class="label">宽度</span>
      <el-input
        v-model.number="width"
        type="number"
        style="width:120px"
        size="mini"
        disabled
      />
    </div>
    <div class="item">
      <span class="label">高度</span>
      <el-input
        v-model.number="height"
        type="number"
        style="width:120px"
        size="mini"
      />
    </div>
    <el-button size="mini" @click="save">确定</el-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'poster/poster.vuex'
export default {
  data() {
    return {
      width: 0,
      height: 0
    }
  },
  computed: {
    ...mapState({
      canvasWidth: (state) => state.canvasSize.width,
      canvasHeight: (state) => state.canvasSize.height
    })
  },
  methods: {
    ...mapActions(['setCanvasSize', 'seekBackgroundSize']),
    save() {
      if (!(this.width && this.height)) {
        return
      }
      this.setCanvasSize({ width: this.width, height: this.height })
      this.seekBackgroundSize()
    }
  },
  created() {
    this.width = this.canvasWidth
    this.height = this.canvasHeight
  }
}
</script>
<style lang="scss" scoped>
.change-size {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.item {
  margin-bottom: 20px;
  .label {
    padding-right: 10px;
  }
}
</style>
