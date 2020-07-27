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
import { mapMutations } from '../../poster.vuex'
import uniqueId from 'lodash/uniqueId'
export default {
  data() {
    return {}
  },
  methods: {
    ...mapMutations(['ADD_ITEM']),
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
      this.ADD_ITEM({
        type: 'image',
        id: uniqueId('image-'),
        componentName: 'image-widget',
        src
      })
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
