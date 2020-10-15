<template>
  <div class="activity-form">
    <!-- <input v-model="formName" class="form-name"> -->
    <div class="content">
      <ul>
        <li v-for="item in formFields" :key="item.label">
          <div class="label">{{ item.label }}</div>
          <div class="placeholder">{{ `请输入${item.label}` }}</div>
        </li>
      </ul>
      <div class="submit-button" :style="submitButtonStyle">{{ submitButtonText }}</div>
    </div>
    <portal v-if="isActive" :to="$data.$controlTarget">
      <widget-control :item="item" />
    </portal>
  </div>
</template>

<script>
import ActivityFormWidget from './constructor'
import widgetControl from './widgetControl'
import { pluginWrap } from '../helpers'

export default {
  components: { widgetControl: pluginWrap(widgetControl) },
  mixins: [ActivityFormWidget.widgetMixin()],
  props: ['pluginHelpers'],
  data() {
    return {}
  },
  computed: {
    formName: {
      get() {
        return this.wState.formName
      },
      set(val) {
        this.pluginHelpers.updateWidgetState('formName', val)
      }
    },
    submitButtonText() {
      return this.wState.submitButtonText
    },
    submitButtonStyle() {
      return this.wState.submitButtonStyle
    },
    formFields() {
      return [
        {
          label: '姓名'
        },
        {
          label: '手机号'
        }
      ]
    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.activity-form {
  width: 100%;
  height: 100%;
  color: #000;
  position: relative;
  z-index: 2;
  display: flex;
  box-sizing: border-box;
  padding: 10px;
  flex-direction: column;
  .form-name {
    width: 70%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    background-color: transparent;
    /* border: 1px solid $colorBorder; */
    margin: 0 auto;
    &:focus {
      border: 1px solid #000;
    }
  }
  .content {
    margin-top: 4px;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    ul {
      width: 100%;
    }
    li {
      display: flex;
      width: 100%;
      height: 40px;
      font-size: 14px;
      align-items: center;
      .label {
        width: 80px;
        @include no-wrap;
        padding: 4px 0;
      }
      .placeholder {
        flex: 1;
        @include no-wrap;
        color: $colorTextL;
        border-bottom: 1px solid $colorBorder;
        margin-left: 10px;
        padding: 4px 0;
      }
    }
    .submit-button{
      padding: 10px 14px;
    }
  }
}
</style>
