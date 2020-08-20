<template>
  <div class="add-text-widget">
    <ul>
      <li
        v-for="(item, index) in presuppositionTextList"
        :key="index"
        class="presupposition-item"
        :style="item.style"
        @click="addText(item)"
      >
        {{ `添加${item.text}` }}
      </li>
    </ul>
    <el-button
      class="add-text"
      size="mini"
      type="plain"
      @click="addText(null)"
    >添加文本</el-button>
  </div>
</template>

<script>
import { mapActions } from 'poster/poster.vuex'
import { TextWidget } from '../../widgetConstructor'

export default {
  data() {
    return {
      presuppositionTextList: [
        {
          text: '标题',
          style: {
            fontSize: '24px'
          }
        },
        {
          text: '副标题',
          style: {
            fontSize: '18px'
          }
        },
        {
          text: '正文内容',
          style: {
            fontSize: '14px'
          }
        },
        {
          text: '粗体文本',
          style: {
            fontSize: '14px',
            fontWeight: 'bold'
          }
        },
        {
          text: '斜体文本',
          style: {
            fontSize: '14px',
            fontStyle: 'italic'
          }
        }
      ]
    }
  },
  methods: {
    ...mapActions(['addItem']),
    addText(item) {
      if (item) {
        this.addItem(
          new TextWidget({
            wState: item
          })
        )
      } else {
        this.addItem(new TextWidget())
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-text-widget {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  .presupposition-item {
    padding: 12px 0 !important;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: $colorTheme !important;
    }
  }
  .add-text {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
