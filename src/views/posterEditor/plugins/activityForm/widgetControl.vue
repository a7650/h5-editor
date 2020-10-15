<template>
  <div class="widget-control_activity-form">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="submitButton">
        <template #title>
          <div class="header">提交按钮</div>
        </template>
        <setting-content>
          <setting-item label="按钮文本">
            <input v-model="inSubmitButtonText" type="text">
          </setting-item>
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
          <setting-item label="背景颜色">
            <el-color-picker v-model="inBackgroundColor" size="small" />
          </setting-item>
          <setting-item label="按钮弧度">
            <el-slider
              v-model="inBorderRadius"
              style="width:100%"
              @input="borderRadiusInput"
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
import { controlMixin } from '../helpers'
export default {
  mixins: [controlMixin],
  props: ['pluginHelpers'],
  data() {
    return {
      activeNames: ['position', 'submitButton']
    }
  },
  computed: {
    inSubmitButtonText: {
      get() {
        return this.wState.submitButtonText
      },
      set(val) {
        this.pluginHelpers.updateWidgetState({
          keyPath: 'submitButtonText',
          value: val,
          widgetId: this.item.id
        })
      }
    },
    inColor: {
      get() {
        return this.wState.submitButtonStyle.color
      },
      set(val) {
        this.updateSubmitButtonStyle('color', val)
      }
    },
    inFontSize: {
      get() {
        return parseInt(this.wState.submitButtonStyle.fontSize)
      },
      set(val) {
        this.updateSubmitButtonStyle('fontSize', val + 'px')
      }
    },
    inBackgroundColor: {
      get() {
        return this.wState.submitButtonStyle.backgroundColor
      },
      set(val) {
        this.updateSubmitButtonStyle('backgroundColor', val)
      }
    },
    inBorderRadius: {
      get() {
        return parseInt(this.wState.submitButtonStyle.borderRadius)
      },
      set(val) {
        this.updateSubmitButtonStyle(
          'borderRadius',
          val + 'px',
          false /** no pushHistory */
        )
      }
    }
  },
  methods: {
    updateSubmitButtonStyle(styleKey, value, pushHistory = true) {
      this.updateWidgetState({
        keyPath: 'submitButtonStyle.' + styleKey,
        value,
        widgetId: this.item.id,
        pushHistory
      })
    },
    borderRadiusInput(flag) {
      if (!this.borderRadiusInit) {
        this.borderRadiusInit = true
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
.widget-control_activity-form {
  width: 100%;
  .header {
    box-sizing: border-box;
    padding: 0 20px;
  }
}
</style>
