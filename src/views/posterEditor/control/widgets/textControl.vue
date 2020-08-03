<template>
  <div class="text-control">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="text">
        <template #title>
          <div class="header">
            文字
          </div>
        </template>
        <setting-content>
          <setting-row>
            <template #left>
              <setting-item label="颜色">
                <el-color-picker v-model="inColor" size="small" />
              </setting-item>
            </template>
            <template #right>
              <setting-item label="字号">
                <input v-model.number="inFontSize" type="number">
              </setting-item>
            </template>
          </setting-row>

          <setting-item label="对齐方式">
            <radio-group v-model="inTextAlign" :list="textAlignList">
              <template #left>
                <i class="icon-align-left" />
              </template>
              <template #center>
                <i class="icon-align-center" />
              </template>
              <template #right>
                <i class="icon-align-right" />
              </template>
            </radio-group>
            <!-- <el-radio-group v-model="inTextAlign" size="mini">
              <el-radio-button label="左对齐" />
              <el-radio-button label="居中" />
              <el-radio-button label="右对齐" />
            </el-radio-group> -->
          </setting-item>
          <setting-row>
            <template #left>
              <setting-item label="行间距">
                <input v-model.number="inLineHeight" type="number">
              </setting-item>
            </template>
            <template #right>
              <setting-item label="字间距">
                <input v-model.number="inLetterSpacing" type="number">
              </setting-item>
            </template>
          </setting-row>
        </setting-content>
      </el-collapse-item>
      <el-collapse-item name="borderAndBackground">
        <template #title>
          <div class="header">边框和背景</div>
        </template>
        <setting-content>
          <setting-item label="背景颜色">
            <el-color-picker v-model="inBackgroundColor" size="small" />
          </setting-item>
          <setting-item label="内边距">
            <input v-model.number="inPadding" type="number">
          </setting-item>
          <!-- <setting-item label="字体样式">
              <input v-model.number="inPadding" type="number">
            </setting-item> -->
          <setting-item label="边框颜色、宽度">
            <el-color-picker v-model="inBorderColor" size="small" />
            <input v-model.number="inBorderWidth" type="number">
          </setting-item>
          <setting-item label="边框样式">
            <radio-group v-model="inBorderStyle" :list="borderStyleList" />
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
    color: {
      type: String,
      default: '#000'
    },
    fontSize: {
      type: Number,
      default: 14
    },
    padding: {
      type: Number,
      default: 0
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
    lineHeight: {
      type: Number,
      default: 1
    },
    letterSpacing: {
      type: Number,
      default: 0
    },
    textAlign: {
      type: String,
      default: 'center'
    },
    backgroundColor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeNames: ['text', 'position', 'borderAndBackground'],
      inDragInfo: {},
      textAlignList: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' }
      ],
      borderStyleList: [
        { label: '实线', value: 'solid' },
        { label: '虚线', value: 'dashed' },
        { label: '双线', value: 'double ' },
        { label: '点线', value: 'dotted ' }
      ]
    }
  },
  computed: {
    inColor: {
      get() {
        return this.color
      },
      set(val) {
        this.$emit('update:color', val)
      }
    },
    inFontSize: {
      get() {
        return this.fontSize
      },
      set(val) {
        this.$emit('update:fontSize', val)
      }
    },
    inPadding: {
      get() {
        return this.padding
      },
      set(val) {
        this.$emit('update:padding', val)
      }
    },
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
    inLineHeight: {
      get() {
        return this.lineHeight
      },
      set(val) {
        this.$emit('update:lineHeight', val)
      }
    },
    inLetterSpacing: {
      get() {
        return this.letterSpacing
      },
      set(val) {
        this.$emit('update:letterSpacing', val)
      }
    },
    inTextAlign: {
      get() {
        return this.textAlign
      },
      set(val) {
        this.$emit('update:textAlign', val)
      }
    },
    inBackgroundColor: {
      get() {
        return this.backgroundColor
      },
      set(val) {
        this.$emit('update:backgroundColor', val)
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
    /* border-style: dashed; */
  }
}
</style>
