<template>
  <div class="custom-contextmenu" :style="menuStyle">
    <ul>
      <li
        v-for="item in menuList"
        :key="item.command"
        :style="item.style"
        @click.stop="command(item)"
      >
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    menuList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      height: 0
    }
  },
  computed: {
    // 菜单位置
    menuStyle() {
      let top = this.y
      if (top > this.maxTop) {
        top = top - this.height
      }
      return {
        height: this.height + 'px',
        left: this.x + 4 + 'px',
        top: top + 4 + 'px'
      }
    }
  },
  watch: {
    menuList: {
      handler(newVal) {
        this.height = newVal.length * 32
        this.maxTop = document.body.clientHeight - this.height
      },
      immediate: true
    }
  },
  methods: {
    command(item) {
      this.$emit('executeCommand', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-contextmenu {
  width: 120px;
  height: 100px;
  background-color: #fff;
  box-shadow: 0 0 16px rgba($color: #000000, $alpha: 0.2);
  user-select: none;
  position: fixed;
  border-radius: 6px;
  overflow-y: hidden;
  animation: enter 0.2s;
  transform-origin: top left;
  z-index: 99;
  ul {
    width: 100%;
    height: 100%;
    li {
      width: 100%;
      height: 32px;
      box-sizing: border-box;
      padding: 0 10px;
      font-size: 13px;
      color: $colorTextL;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      &:first-of-type {
        border-radius: 6px 6px 0 0;
      }
      &:last-of-type {
        border-radius: 0 0 6px 6px;
      }
      &:hover {
        background-color: $colorThemeL;
        color: $colorText;
        /* color: #fff; */
      }
    }
  }
  @keyframes enter {
    0% {
      transform: scale(0.4);
      opacity: 0;
    }
    100% {
      transform: 1;
      opacity: 1;
    }
  }
}
</style>
