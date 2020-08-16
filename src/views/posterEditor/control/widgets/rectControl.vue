<template>
  <div class="rect-control">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="borderAndBackground">
        <template #title>
          <div class="header">边框和背景</div>
        </template>
        <setting-content>
          <setting-item label="背景颜色">
            <el-color-picker v-model="inBackgroundColor" size="small" />
          </setting-item>
          <setting-item label="边框颜色、宽度">
            <el-color-picker v-model="inBorderColor" size="small" />
            <input v-model.number="inBorderWidth" type="number">
          </setting-item>
          <setting-item label="边框样式">
            <radio-group v-model="inBorderStyle" :list="borderStyleList" />
          </setting-item>
          <setting-item label="左上角弧度">
            <el-slider v-model="inBorderTopLeftRadius" style="width:100%" />
          </setting-item>
          <setting-item label="右上角弧度">
            <el-slider v-model="inBorderTopRightRadius" style="width:100%" />
          </setting-item>
          <setting-item label="左下角弧度">
            <el-slider v-model="inBorderBottomLeftRadius" style="width:100%" />
          </setting-item>
          <setting-item label="右下角弧度">
            <el-slider v-model="inBorderBottomRightRadius" style="width:100%" />
          </setting-item>
        </setting-content>
      </el-collapse-item>
      <el-collapse-item name="position">
        <template #title>
          <div class="header">
            位置
          </div>
        </template>
        <setting-content>
          <setting-item label="宽度">
            <input v-model.number="dragInfo.w" type="number">
          </setting-item>
          <setting-item label="高度">
            <input v-model.number="dragInfo.h" type="number">
          </setting-item>
          <setting-item label="距顶部距离">
            <input v-model.number="dragInfo.y" type="number">
          </setting-item>
          <setting-item label="距左侧距离">
            <input v-model.number="dragInfo.x" type="number">
          </setting-item>
          <setting-item label="旋转角度">
            <input v-model.number="dragInfo.rotateZ" type="number">
          </setting-item>
        </setting-content>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { commonMixin } from './common/mixins'

export default {
  mixins: [commonMixin],
  data() {
    return {
      activeNames: ['position', 'borderAndBackground'],
      borderStyleList: [
        { label: '实线', value: 'solid' },
        { label: '虚线', value: 'dashed' },
        { label: '双线', value: 'double ' },
        { label: '点线', value: 'dotted ' }
      ]
    }
  },
  computed: {
    inBorderColor: {
      get() {
        return this.style.borderColor
      },
      set(val) {
        this.updateStyle('borderColor', val)
      }
    },
    inBorderWidth: {
      get() {
        return this.style.borderWidth
      },
      set(val) {
        this.updateStyle('borderWidth', val)
      }
    },
    inBorderStyle: {
      get() {
        return this.style.borderStyle
      },
      set(val) {
        this.updateStyle('borderStyle', val)
      }
    },
    inBackgroundColor: {
      get() {
        return this.style.backgroundColor
      },
      set(val) {
        this.updateStyle('backgroundColor', val)
      }
    },
    inBorderTopLeftRadius: {
      get() {
        return this.style.borderTopLeftRadius
      },
      set(val) {
        this.updateStyle('borderTopLeftRadius', val)
      }
    },
    inBorderTopRightRadius: {
      get() {
        return this.style.borderTopRightRadius
      },
      set(val) {
        this.updateStyle('borderTopRightRadius', val)
      }
    },
    inBorderBottomLeftRadius: {
      get() {
        return this.style.borderBottomLeftRadius
      },
      set(val) {
        this.updateStyle('borderBottomLeftRadius', val)
      }
    },
    inBorderBottomRightRadius: {
      get() {
        return this.style.borderBottomRightRadius
      },
      set(val) {
        this.updateStyle('borderBottomRightRadius', val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.rect-control {
  width: 100%;
  .header {
    box-sizing: border-box;
    padding: 0 20px;
    /* border-style: dashed; */
  }
}
</style>
