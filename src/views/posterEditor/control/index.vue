<template>
  <div class="poster-editor-control poster-editor_deactivated-ignore">
    <portal-target name="widgetControl" class="control-target" />
    <!-- 多组件编辑 -->
    <widget-composition-control />
  </div>
</template>

<script>
import widgetCompositionControl from './widgets/widgetCompositionControl'
export default {
  components: { widgetCompositionControl },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.poster-editor-control {
  width: 100%;
  height: 100%;
  position: relative;
  .control-target {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }
}
</style>
