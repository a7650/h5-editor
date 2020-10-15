<template>
  <div class="page-template">
    <div class="template-item" @click="selectTemplate">
      <img src="./template.png" alt="基础模板">
      <div class="title">基础模板</div>
    </div>
    <input ref="input" type="file" style="display:none" @change="selectImg">
  </div>
</template>

<script>
import { validateImage, getImageSize } from '@/utils/imageHelpers'
import templateData from './template'
export default {
  props: ['pluginHelpers'],
  methods: {
    selectTemplate() {
      this.$refs.input.click()
    },
    async selectImg({ currentTarget: inputNode }) {
      const file = inputNode.files
      const imgData = file
      const canvasSize = this.pluginHelpers.getCanvasSize()
      const src = (await validateImage(imgData && imgData[0])).src
      const { width, height } = await getImageSize(src)
      const imageHeight = parseInt(canvasSize.width * (height / width))
      templateData.posterItems[0].dragInfo = {
        x: 0,
        y: 0,
        w: canvasSize.width,
        h: imageHeight
      }
      templateData.posterItems[0].wState.src = src
      templateData.posterItems[1].dragInfo = {
        x: 0,
        y: imageHeight,
        w: canvasSize.width,
        h: 200
      }
      this.pluginHelpers.setCanvasSize({
        ...canvasSize,
        height: Math.max(canvasSize.height, imageHeight + 200)
      })
      this.pluginHelpers.recoverEditorData(templateData)
      inputNode.value = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.page-template {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  .template-item {
    width: 100%;
    border: 1px solid $colorBorder;
    border-radius: 4px;
    user-select: none;
    cursor: pointer;
    img {
      display: block;
      width: 100%;
      height: 100px;
      object-fit: contain;
    }
    .title {
      font-size: 14px;
      color: $colorText;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      padding: 5px 10px;
    }
    &:hover {
      border-color: $colorTheme;
    }
  }
}
</style>
