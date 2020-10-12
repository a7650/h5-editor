<template>
  <div class="page-template">
    <el-button
      class="template-item"
      @click="selectTemplate"
    >基础模板</el-button>
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
}
</style>
