<template>
  <div class="radio-group">
    <ul>
      <li
        v-for="(item, index) in list"
        :key="index"
        class="item"
        :class="{ active: valueFormat.includes(item.value) }"
        :title="item.label"
        @click="select(item)"
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
    event: 'change',
    prop: 'value'
  },
  props: {
    list: {
      type: Array,
      default() {
        return [] // [{label:'',value:''}]
      }
    },
    value: {
      type: [String, Array],
      default: ''
    }
  },
  computed: {
    valueFormat() {
      return Array.isArray(this.value) ? this.value : [this.value]
    }
  },
  methods: {
    select(item) {
      let finalValue
      if (typeof this.value === 'string') {
        finalValue = this.value === item.value ? '' : item.value
        this.$emit('change', finalValue)
      } else if (Array.isArray(this.value)) {
        let operation = ''
        const value = item.value
        if (this.value.includes(item.value)) {
          operation = 'remove'
          finalValue = this.value.filter((i) => i !== item.value)
        } else {
          operation = 'add'
          finalValue = [...this.value, item.value]
        }
        finalValue._operation = operation
        finalValue._value = value
        this.$emit('change', finalValue)
      }
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
      &:hover{
        background-color: $colorThemeL;
      }
      &.active {
        background-color: $colorTheme;
        color: #fff;
      }
    }
  }
}
</style>
