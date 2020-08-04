<template>
  <div class="radio-group">
    <ul>
      <li
        v-for="(item, index) in list"
        :key="index"
        class="item"
        :class="{ active: current === item.value }"
        :title="item.label"
        @click="$emit('currentLabelChange', item.value)"
      >
        <slot :name="item.value">
          {{ item.label }}
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  model: {
    event: 'currentLabelChange',
    prop: 'current'
  },
  props: {
    list: {
      type: Array,
      default() {
        return [] // [{label:'',value:''}]
      }
    },
    current: {
      type: null,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-group {
  width: 100%;
  ul {
    width: 100%;
    height: 28px;
    display: flex;
    li {
      width: 1px;
      height: 100%;
      box-sizing: border-box;
      padding: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      font-size: 13px;
      @include no-wrap;
      border-color: #ccd5db;
      border-style: solid;
      border-top-width: 1px;
      border-bottom-width: 1px;
      border-left-width: 1px;
      transition: 0.1s;
      background-color: #fff;
      user-select: none;
      cursor: pointer;
      color: $colorText;
      &:first-child {
        border-radius: 4px 0 0 4px;
      }
      &:last-child {
        border-radius: 0 4px 4px 0;
        border-right-width: 1px;
      }
      &:hover,
      &.active {
        background-color: $colorTheme;
        color: #fff;
      }
    }
  }
}
</style>
