<template>
  <div
    class="main-panel"
    :style="{
      width: canvasSize.width + 'px',
      height: canvasSize.height + 'px'
    }"
  >
    <background-widget
      v-if="background"
      :key="background.id"
      :item="background"
    />
    <component
      :is="item.componentName"
      v-for="item in posterItems"
      v-show="item.visible"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script>
import imageWidget from './widgets/imageWidget'
import backgroundWidget from './widgets/backgroundWidget'
import textWidget from './widgets/textWidget'
import drawRectWidget from './widgets/rectWidget'
import rectWidget from './widgets/rectWidget'
import { mapState, mapMutations } from '../poster.vuex'
export default {
  components: {
    imageWidget,
    backgroundWidget,
    textWidget,
    drawRectWidget,
    rectWidget
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['posterItems', 'canvasSize', 'background'])
  },
  methods: {
    ...mapMutations(['SET_CANVAS_SIZE'])
  },
  created() {
    this.SET_CANVAS_SIZE({ width: 338, height: 600 })
  }
}
</script>
<style lang="scss" scoped>
.main-panel {
  background-color: #fff;
  position: absolute;
  top: 50%;
  margin-top: -300px;
  left: 50%;
  margin-left: -169px;
  user-select: none;
  box-shadow: 0 0 6px rgba($color: #000000, $alpha: 0.1);
  .poster-item-container {
    /* position: absolute;
    top: 0; */
  }
}
</style>
