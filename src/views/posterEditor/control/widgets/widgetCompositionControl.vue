<template>
  <div v-if="activeItems.length > 1" class="widget-composition-control">
    <setting-content>
      <setting-item label="组件对齐">
        <radio-group
          :list="alignList"
          @change="changeCompositionPosition($event)"
        />
      </setting-item>
    </setting-content>
  </div>
</template>

<script>
import { mapActions, mapState } from 'poster/poster.vuex'
import { settingContent, settingItem, radioGroup } from 'poster/commonUI'

export default {
  components: { settingContent, settingItem, radioGroup },
  data() {
    return {
      alignList: [
        { label: '左对齐', value: 'alignLeft' },
        { label: '居中', value: 'alignCenter' },
        { label: '右对齐', value: 'alignRight' }
      ]
    }
  },
  computed: {
    ...mapState(['activeItems'])
  },
  methods: {
    ...mapActions(['changeCompositionPosition'])
  }
}
</script>

<style lang="scss" scoped>
.widget-composition-control {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
}
</style>
