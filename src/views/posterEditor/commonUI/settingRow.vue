<template functional>
  <div class="setting-row">
    <slot name="left" />
    <div class="gap" />
    <slot name="right" />
  </div>
</template>

<style lang="scss" scoped>
.setting-row {
  display: flex;
  justify-content: space-between;
  .gap{
    width: 10px;
  }
}
</style>
