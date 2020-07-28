<template>
  <div class="layer-panel">
    <ul>
      <li v-for="item in posterItems" :key="item.id">{{ item.id }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'poster/poster.vuex'
export default {
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
.layer-panel {
  width: 100px;
  height: 100px;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0 0 6px rgba($color: #000000, $alpha: 0.1);
}
</style>
