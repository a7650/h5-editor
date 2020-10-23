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
            <el-slider
              v-model="inBorderTopLeftRadius"
              style="width:100%"
              @input="borderRadiusInput('tl')"
              @change="borderRadiusChange"
            />
          </setting-item>
          <setting-item label="右上角弧度">
            <el-slider
              v-model="inBorderTopRightRadius"
              style="width:100%"
              @input="borderRadiusInput('tr')"
              @change="borderRadiusChange"
            />
          </setting-item>
          <setting-item label="左下角弧度">
            <el-slider
              v-model="inBorderBottomLeftRadius"
              style="width:100%"
              @input="borderRadiusInput('bl')"
              @change="borderRadiusChange"
            />
          </setting-item>
          <setting-item label="右下角弧度">
            <el-slider
              v-model="inBorderBottomRightRadius"
              style="width:100%"
              @input="borderRadiusInput('br')"
              @change="borderRadiusChange"
            />
          </setting-item>
        </setting-content>
      </el-collapse-item>
      <el-collapse-item name="position">
        <template #title>
          <div class="header">
            位置
          </div>
        </template>
        <position-control :drag-info="dragInfo" />
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
      ],
      borderRadiusInit: {}
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
        return parseInt(this.style.borderWidth)
      },
      set(val) {
        this.updateStyle('borderWidth', val + 'px')
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
        return parseInt(this.style.borderTopLeftRadius)
      },
      set(val) {
        this.updateStyle('borderTopLeftRadius', val + '%', false /** no pushHistory */)
      }
    },
    inBorderTopRightRadius: {
      get() {
        return parseInt(this.style.borderTopRightRadius)
      },
      set(val) {
        this.updateStyle(
          'borderTopRightRadius',
          val + '%',
          false /** no pushHistory */
        )
      }
    },
    inBorderBottomLeftRadius: {
      get() {
        return parseInt(this.style.borderBottomLeftRadius)
      },
      set(val) {
        this.updateStyle(
          'borderBottomLeftRadius',
          val + '%',
          false /** no pushHistory */
        )
      }
    },
    inBorderBottomRightRadius: {
      get() {
        return parseInt(this.style.borderBottomRightRadius)
      },
      set(val) {
        this.updateStyle(
          'borderBottomRightRadius',
          val + '%',
          false /** no pushHistory */
        )
      }
    }
  },
  methods: {
    borderRadiusInput(flag) {
      // el-slider初始化时会派发input事件
      // 所以在初始化时候忽略该事件
      // 防止往撤销的历史栈里添加数据
      if (!this.borderRadiusInit[flag]) {
        this.borderRadiusInit[flag] = true
        return
      }
      if (!this.borderRadiusDragging) {
        this.borderRadiusDragging = true
        this.pushHistory()
      }
    },
    borderRadiusChange() {
      this.borderRadiusDragging = false
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
