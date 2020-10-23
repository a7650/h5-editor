<template>
  <div class="page-setting">
    <div class="page-title" :style="{ width: canvasSize.width + 'px' }">
      <div class="label">页面标题</div>
      <input v-model="inPageTitle" type="text">
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'poster/poster.vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['pageTitle']),
    inPageTitle: {
      get() {
        return this.pageTitle
      },
      set(val) {
        this.SET_PAGE_TITLE(val)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_PAGE_TITLE'])
  }
}
</script>
<style lang="scss" scoped>
.page-title {
  background-color: #1d2024;
  color: #9099a4;
  font-size: 14px;
  height: 24px;
  position: absolute;
  top: 24px;
  left: 50%;
  display: flex;
  align-items: center;
  transform: translateX(-50%);
  box-sizing: border-box;
  padding: 0 10px;
  .label {
    margin-right: 10px;
  }
  input {
    background-color: transparent;
    color: #9099a4;
    flex: 1;
    border-bottom: 1px solid #9099a4;
  }
}
</style>
