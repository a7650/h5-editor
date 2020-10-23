<template>
  <div class="add-background-widget">
    <div class="title">纯色背景</div>
    <el-color-picker
      v-model="backgroundColor"
      show-alpha
      size="mini"
      @change="backgroundColorChange"
    />
    <div class="title">推荐颜色</div>
    <div class="recommend-color">
      <ul>
        <li
          v-for="(item, index) in recommendColor"
          :key="index"
          :style="{ backgroundColor: `rgb(${item})` }"
          @click="selectRecommend(`rgb(${item})`)"
        />
      </ul>
    </div>
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
import { uploadActivityImgAssets } from '@/api/activity'
import { validateImage } from '@/utils/imageHelpers'

export default {
  data() {
    return {
      backgroundColor: '',
      // 推荐颜色 ['r,g,b']
      recommendColor: [
        '232,221,203',
        '205,179,128',
        '3,101,100',
        '3,54,73',
        '3,22,52',
        '255,67,101',
        '252,157,153',
        '249,204,173',
        '201,200,170',
        '132,175,155',
        '17,63,61',
        '60,79,57',
        '95,92,51',
        '179,214,110',
        '248,147,29',
        '227,160,92',
        '178,190,126',
        '114,111,128',
        '57,13,49',
        '90,61,66'
      ]
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
          lock: true,
          wState: {
            isSolid: true,
            style: {
              backgroundColor: this.backgroundColor
            }
          }
        })
      )
    },
    selectRecommend(rgb) {
      this.backgroundColor = rgb
      this.backgroundColorChange()
    },
    selectImgHandler() {
      this.$refs.input.click()
    },
    async selectImg({ currentTarget: inputNode }) {
      try {
        const file = inputNode.files
        const imgFile = file && file[0]
        await validateImage(imgFile)
        const src = await uploadActivityImgAssets(imgFile)
        this.addBackground(
          new BackgroundWidget({
            wState: {
              src,
              isSolid: false
            }
          })
        )
      } catch (e) {
        console.error(e)
      } finally {
        inputNode.value = ''
      }
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
    font-size: 12px;
    font-weight: bold;
    color: $colorText;
  }
  .recommend-color {
    ul {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(34px, 1fr));
      li {
        height: 24px;
        width: 24px;
        margin-bottom: 10px;
        transition: 0.2s;
        cursor: pointer;
        border-radius: 2px;
        &:hover {
          transform: scale(1.2);
        }
      }
    }
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
