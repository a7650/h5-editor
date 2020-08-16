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
      activeNames: ['text', 'position', 'borderAndBackground'],
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
        return this.style.color
      },
      set(val) {
        this.updateStyle('color', val)
      }
    },
    inFontSize: {
      get() {
        return this.style.fontSize
      },
      set(val) {
        this.updateStyle('fontSize', val)
      }
    },
    inPadding: {
      get() {
        return this.style.padding
      },
      set(val) {
        this.updateStyle('padding', val)
      }
    },
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
    inLineHeight: {
      get() {
        return this.style.lineHeight
      },
      set(val) {
        this.updateStyle('lineHeight', val)
      }
    },
    inLetterSpacing: {
      get() {
        return this.style.letterSpacing
      },
      set(val) {
        this.updateStyle('letterSpacing', val)
      }
    },
    inTextAlign: {
      get() {
        return this.style.textAlign
      },
      set(val) {
        this.updateStyle('textAlign', val)
      }
    },
    inBackgroundColor: {
      get() {
        return this.style.backgroundColor
      },
      set(val) {
        this.updateStyle('backgroundColor', val)
      }
    }
  },
  methods: {}
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
