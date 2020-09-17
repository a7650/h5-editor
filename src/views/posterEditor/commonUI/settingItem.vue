<template functional>
  <div class="setting-item">
    <div class="label">{{ props.label }}</div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting-item {
  margin-bottom: 10px;
  .label {
    height: 24px;
    line-height: 24px;
  }
  .content {
    display: flex;
    ::v-deep {
      input {
        width: 100%;
        height: 32px;
        border: 1px solid #ccd5db;
        box-sizing: border-box;
        padding: 0 4px;
        border-radius: 2px;
      }
      input:focus {
        border-color: $colorTheme;
      }
    }
  }
}
</style>
