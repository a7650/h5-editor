<template>
  <div class="reference-line-setting">
    <div>
      <span>
        打开参考线
      </span>
      <el-switch v-model="referenceLineOpened" />
    </div>
    <div>
      <el-button type="primary" size="mini" @click="removeAll">清空参考线</el-button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    referenceLineOpened: {
      get() {
        return this.$store.state.poster.referenceLineOpened
      },
      set(val) {
        this.$store.dispatch('poster/setReferenceLineVisible', val)
      }
    }
  },
  methods: {
      removeAll() {
        this.$store.dispatch('poster/removeAllReferenceLine')
      }
  }
}
</script>

<style lang="scss" scoped>
.reference-line-setting {
  & > div {
    display: flex;
    justify-content: space-between;
    .el-button {
      margin-top: 14px;
      width: 100%;
    }
  }
}
</style>
