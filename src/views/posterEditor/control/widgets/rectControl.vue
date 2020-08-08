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
            <input v-model.number="inDragInfo.w" type="number">
          </setting-item>
          <setting-item label="高度">
            <input v-model.number="inDragInfo.h" type="number">
          </setting-item>
          <setting-item label="距顶部距离">
            <input v-model.number="inDragInfo.y" type="number">
          </setting-item>
          <setting-item label="距左侧距离">
            <input v-model.number="inDragInfo.x" type="number">
          </setting-item>
          <setting-item label="旋转角度">
            <input v-model.number="inDragInfo.rotateZ" type="number">
          </setting-item>
        </setting-content>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import settingContent from './ui/settingContent'
import settingItem from './ui/settingItem'
import settingRow from './ui/settingRow'
import radioGroup from './ui/radioGroup'

export default {
  components: { settingContent, settingItem, settingRow, radioGroup },
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
    borderColor: {
      type: String,
      default: ''
    },
    borderWidth: {
      type: Number,
      default: 0
    },
    borderStyle: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    borderTopLeftRadius: {
      type: Number,
      default: 0
    },
    borderTopRightRadius: {
      type: Number,
      default: 0
    },
    borderBottomLeftRadius: {
      type: Number,
      default: 0
    },
    borderBottomRightRadius: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activeNames: ['position', 'borderAndBackground'],
      inDragInfo: {},
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
        return this.borderColor
      },
      set(val) {
        this.$emit('update:borderColor', val)
      }
    },
    inBorderWidth: {
      get() {
        return this.borderWidth
      },
      set(val) {
        this.$emit('update:borderWidth', val)
      }
    },
    inBorderStyle: {
      get() {
        return this.borderStyle
      },
      set(val) {
        this.$emit('update:borderStyle', val)
      }
    },
    inBackgroundColor: {
      get() {
        return this.backgroundColor
      },
      set(val) {
        this.$emit('update:backgroundColor', val)
      }
    },
    inBorderTopLeftRadius: {
      get() {
        return this.borderTopLeftRadius
      },
      set(val) {
        this.$emit('update:borderTopLeftRadius', val)
      }
    },
    inBorderTopRightRadius: {
      get() {
        return this.borderTopRightRadius
      },
      set(val) {
        this.$emit('update:borderTopRightRadius', val)
      }
    },
    inBorderBottomLeftRadius: {
      get() {
        return this.borderBottomLeftRadius
      },
      set(val) {
        this.$emit('update:borderBottomLeftRadius', val)
      }
    },
    inBorderBottomRightRadius: {
      get() {
        return this.borderBottomRightRadius
      },
      set(val) {
        this.$emit('update:borderBottomRightRadius', val)
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
.rect-control {
  width: 100%;
  .header {
    box-sizing: border-box;
    padding: 0 20px;
    /* border-style: dashed; */
  }
}
</style>
