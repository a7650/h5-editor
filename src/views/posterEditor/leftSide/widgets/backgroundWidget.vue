<template>
  <div class="add-background-widget">
    <div class="title">纯色背景</div>
    <el-color-picker
      v-model="backgroundColor"
      show-alpha
      size="mini"
      @change="backgroundColorChange"
    />
    <div class="title">图片背景</div>
    <el-button
      class="add-image"
      size="mini"
      type="plain"
      @click="selectImgHandler"
    >添加背景图片</el-button>
    <input ref="input" type="file" style="display:none" @change="selectImg">
  </div>
</template>

<script>
import { mapActions, mapState } from 'poster/poster.vuex'
import { BackgroundWidget } from '../../widgetConstructor'
export default {
  data() {
    return {
      backgroundColor: ''
    }
  },
  computed: {
    ...mapState(['canvasSize'])
  },
  methods: {
    ...mapActions(['addBackground']),
    backgroundColorChange() {
      this.addBackground(
        new BackgroundWidget({
          backgroundColor: this.backgroundColor,
          isSolid: true,
          lock: true
        })
      )
    },
    selectImgHandler() {
      this.$refs.input.click()
    },
    selectImg({ currentTarget: inputNode }) {
      const file = inputNode.files
      let imgData = file
      const reader = new FileReader()
      reader.onload = () => {
        this.addBackground(
          new BackgroundWidget({
            src: reader.result,
            isSolid: false
          })
        )
      }
      if (imgData && (imgData = imgData[0])) {
        if (!/image/.test(imgData.type)) {
          alert('请选择图片文件')
        } else {
          reader.readAsDataURL(imgData)
        }
      }
      inputNode.value = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.add-background-widget {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  .title {
    width: 100%;
    padding: 10px 0;
    font-size: 14px;
    font-weight: bold;
    color: $colorText;
  }
  .add-image {
    width: 100%;
  }
  ::v-deep {
    .el-color-picker,
    .el-color-picker__trigger {
      width: 100% !important;
    }
  }
}
</style>
