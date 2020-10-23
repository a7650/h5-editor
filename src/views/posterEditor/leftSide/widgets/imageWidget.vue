<template>
  <div class="add-image-widget">
    <el-button
      class="add-image"
      size="mini"
      type="plain"
      @click="selectImgHandler"
    >添加图片</el-button>
    <input ref="input" type="file" style="display:none" @change="selectImg">
  </div>
</template>

<script>
import { mapActions } from 'poster/poster.vuex'
import { ImageWidget } from '../../widgetConstructor'
import { validateImage } from '@/utils/imageHelpers'
import { uploadActivityImgAssets } from '@/api/activity'
export default {
  data() {
    return {}
  },
  methods: {
    ...mapActions(['addItem']),
    selectImgHandler() {
      this.$refs.input.click()
    },
    async selectImg({ currentTarget: inputNode }) {
      try {
        const file = inputNode.files
        const imgFile = file && file[0]
        await validateImage(imgFile)
        const src = await uploadActivityImgAssets(imgFile)
        this.addImage({ src })
      } catch (e) {
        console.error(e)
      } finally {
        inputNode.value = ''
      }
    },
    addImage({ src }) {
      this.addItem(new ImageWidget({ wState: { src }}))
    }
  }
}
</script>
<style lang="scss" scoped>
.add-image-widget {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  .add-image {
    width: 100%;
  }
}
</style>
