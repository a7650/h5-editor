<template>
  <setting-content>
    <setting-item label="宽度">
      <input v-model.number="dragInfo.w" type="number">
    </setting-item>
    <setting-item label="高度">
      <input v-model.number="dragInfo.h" type="number">
    </setting-item>
    <setting-item label="距顶部距离">
      <input v-model.number="dragInfo.y" type="number">
    </setting-item>
    <setting-item label="距左侧距离">
      <input v-model.number="dragInfo.x" type="number">
    </setting-item>
    <setting-item label="旋转角度">
      <input v-model.number="dragInfo.rotateZ" type="number">
    </setting-item>
  </setting-content>
</template>

<script>
import { settingContent, settingItem } from 'poster/commonUI'
export default {
  components: { settingContent, settingItem },
  props: {
    dragInfo: {
      type: Object,
      default() {
        return {}
      },
      require: true
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped></style>
