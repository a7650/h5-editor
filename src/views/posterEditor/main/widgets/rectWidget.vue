<template>
  <div class="rect-widget" :style="rectStyleFilter">
    <!-- {{ isActive }} -->
    <portal v-if="isActive" :to="$data.$controlTarget">
      <rect-control :key="item.id" :item="item" />
    </portal>
  </div>
</template>

<script>
import rectControl from '../../control/widgets/rectControl'
import { RectWidget } from 'poster/widgetConstructor'
// import { mapGetters, mapActions } from 'poster/poster.vuex'
export default {
  components: { rectControl },
  mixins: [RectWidget.widgetMixin()],
  data() {
    return {}
  },
  computed: {
    rectStyleFilter() {
      const style = this.wState.style
      return Object.assign({}, style, {
        borderWidth: style.borderWidth + 'px',
        borderTopLeftRadius: style.borderTopLeftRadius + '%',
        borderTopRightRadius: style.borderTopRightRadius + '%',
        borderBottomLeftRadius: style.borderBottomLeftRadius + '%',
        borderBottomRightRadius: style.borderBottomRightRadius + '%'
      })
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.drag-item {
  user-select: none;
  .rect-widget {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
}
</style>
