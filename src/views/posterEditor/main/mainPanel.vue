<template>
  <div class="main-panel">
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
import { mapState } from '../poster.vuex'
export default {
  components: { imageWidget },
  data() {
    return {}
  },
  computed: {
    ...mapState(['posterItems'])
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.main-panel {
  width: 338px;
  height: 600px;
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
