<template>
  <div class="add-image-widget">
    <el-button
      class="add-image"
      size="mini"
      type="primary"
      @click="selectImgHandler"
    >添加图片</el-button>
    <input ref="input" type="file" style="display:none" @change="selectImg">
  </div>
</template>

<script>
import { mapActions } from 'poster/poster.vuex'
import { ImageWidget } from '../../widgetConstructor'
export default {
  data() {
    return {}
  },
  methods: {
    ...mapActions(['addItem']),
    selectImgHandler() {
      this.$refs.input.click()
    },
    selectImg({ currentTarget: inputNode }) {
      const file = inputNode.files
      let imgData = file
      const reader = new FileReader()
      reader.onload = () => {
        this.addImage({
          src: reader.result
        })
      }
      if (imgData && (imgData = imgData[0])) {
        if (!/image/.test(imgData.type)) {
          alert('请选择图片文件')
        } else {
          reader.readAsDataURL(imgData)
        }
      }
      inputNode.value = ''
    },
    addImage({ src }) {
      this.addItem(new ImageWidget({ src }))
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
