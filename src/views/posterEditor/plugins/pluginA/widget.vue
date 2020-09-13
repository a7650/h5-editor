<template>
  <div class="plugin-a">
    <button v-for="item in wState.buttonCount" :key="item">{{ item }}</button>
    <portal v-if="isActive" :to="$data.$controlTarget">
      <widget-control :item="item" />
    </portal>
  </div>
</template>

<script>
import PluginA from './constructor'
import widgetControl from './widgetControl'
import { pluginWrap } from '../helpers'
export default {
  components: { widgetControl: pluginWrap(widgetControl) },
  mixins: [PluginA.widgetMixin()],
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.plugin-a {
  width: 100%;
  height: 100%;
  color: #000;
  /* position: relative; */
  /* z-index: 2; */
  display: flex;
  button {
    flex: 1;
    height: 100%;
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
