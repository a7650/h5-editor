<template>
  <div class="poster-editor">
    <left-side />
    <main-component />
    <control-component />
  </div>
</template>

<script>
import { mapState, mapMutations } from './poster.vuex'
import controlComponent from './control/index'
import mainComponent from './main/index'
import leftSide from './leftSide/index'

export default {
  components: { controlComponent, mainComponent, leftSide },
  computed: {
    ...mapState(['items'])
  },
  methods: {
    ...mapMutations(['ADD_ITEM'])
  }
}
</script>

<style lang="scss" scoped>
.poster-editor {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: fixed;
  display: flex;
  .left-side {
    height: 100%;
  }
  .poster-editor-main {
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    border-right: 1px solid $colorBorder;
  }
  .poster-editor-control {
    width: 300px;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
