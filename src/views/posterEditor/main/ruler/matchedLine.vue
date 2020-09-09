<template>
  <div v-if="matchedLine" class="matched-line">
    <div
      v-for="(item, index) in matchedLine.col"
      :key="'col' + index"
      class="reference-line column"
      :style="{ left: item + 'px' }"
    />
    <div
      v-for="(item, index) in matchedLine.row"
      :key="'row' + index"
      class="reference-line row"
      :style="{ top: item + 'px',...rowElPositionFix }"
    />
  </div>
</template>

<script>
import { mapState } from 'poster/poster.vuex'
export default {
  props: {
    rowElPositionFix: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['matchedLine'])
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.reference-line {
  /* background-color: #ff0000; */
  position: absolute;
  z-index: 99;
  &.column {
    width: 0px;
    border-left: 1px dashed #ff0000;
    height: 5000px;
    /* margin-left: -2px; */
    top: 0;
    /* background: linear-gradient(
      90deg,
      transparent 33.3%,
      #eceef0 0,
      #ff0000 66.6%,
      transparent 0
    ); */
    .tip {
      top: 30px;
      left: 10px;
    }
  }
  &.row {
    width: 5000px;
    height: 0px;
    /* margin-top: -2px; */
    left: 0;
    border-top: 1px dashed #ff0000;
    /* background: linear-gradient(
      0deg,
      transparent 33.3%,
      #eceef0 0,
      #ff0000 66.6%,
      transparent 0
    ); */
    .tip {
      top: -30px;
      left: 30px;
    }
  }
}
</style>
