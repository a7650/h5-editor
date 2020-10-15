<template>
  <div class="functional-bar">
    <ul>
      <li>
        <i class="el-icon-upload" />
        <span>保存页面</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.functional-bar {
  background-color: #1d2024;
  border-radius: 2px;
  position: fixed;
  top: 26px;
  right: 254px;
  padding: 4px 10px;
  box-shadow: 0 0 6px rgba($color: #000000, $alpha: .2);
  li {
    user-select: none;
    cursor: pointer;
    color: #9099a4;
    &:hover {
      color: #fff;
    }
    i {
      font-size: 16px;
      padding-right: 4px;
    }
    span {
      font-size: 14px;
    }
  }
}
</style>
