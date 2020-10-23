<template>
  <div class="panel-item" @click="select">
    <i :class="item.icon" class="icon" :title="item.typeLabel" />
    <input
      v-if="isEditing"
      v-model="rename"
      v-clickoutside="saveName"
      type="text"
      class="name"
      ondragstart="return false"
      @keydown.enter="saveName"
    >
    <div v-else class="name" @dblclick="isEditing = true">
      {{ rename }}
    </div>
    <div class="handle">
      <i
        class="el-icon-delete-solid remove"
        :title="item.lock ? '已锁定，无法删除' : '删除'"
        @click.stop="remove"
      />
      <i
        v-if="!item.lock"
        class="el-icon-unlock"
        title="锁定"
        @click.stop="lock"
      />
      <i v-else class="el-icon-lock" title="解除锁定" @click.stop="unlock" />
      <i
        class="el-icon-view"
        title="隐藏"
        :class="{ hide: !item.visible }"
        @click.stop="hide"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'poster/poster.vuex'
import { clickoutside } from 'poster/poster.directives'
export default {
  directives: { clickoutside },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      rename: '',
      isEditing: false
    }
  },
  computed: {
    ...mapGetters(['activeItemIds'])
  },
  created() {
    if (this.item.type === 'text') {
      this.rename = this.item.wState.text
    } else {
      this.rename = this.item.id
    }
  },
  methods: {
    ...mapActions([
      'removeItem',
      'lockItem',
      'unlockItem',
      'toggleItemVisible',
      'replaceActiveItems',
      'addActiveItem',
      'removeActiveItem'
    ]),
    saveName() {
      this.isEditing = false
    },
    select(e) {
      if (this.isEditing) {
        return
      }
      if (e.ctrlKey) {
        if (this.activeItemIds.includes(this.item.id)) {
          this.removeActiveItem(this.item)
        } else {
          this.addActiveItem(this.item)
        }
      } else {
        this.replaceActiveItems([this.item])
      }
    },
    remove() {
      this.removeItem(this.item)
    },
    lock() {
      this.lockItem(this.item)
    },
    unlock() {
      this.unlockItem(this.item)
    },
    hide() {
      this.toggleItemVisible({ item: this.item, visible: !this.item.visible })
    }
  }
}
</script>
<style lang="scss" scoped>
.panel-item {
  box-sizing: border-box;
  padding: 0 20px;
  height: 36px;
  display: flex;
  align-items: center;
  @include no-wrap;
  font-size: 14px;
  background-color: #252930;
  border-bottom: 1px solid #1d2024;
  cursor: pointer;
  /* transition: 0.2s; */
  color: #9099a4;
  border-left: 2px solid transparent;
  &:hover {
    background-color: #404955;
    color: #fff;
    .handle {
      .remove {
        display: initial !important;
      }
    }
  }
  &.sortable-ghost {
    opacity: 0;
    cursor: pointer;
  }
  .icon {
    padding-right: 4px;
  }
  .name {
    width: 1px;
    flex: 1;
    @include no-wrap;
  }
  .handle {
    margin-left: 20px;
    i {
      margin-left: 4px;
    }
    .el-icon-lock {
      color: #fff;
    }
    .el-icon-view {
      position: relative;
      &::after{
        content: "";
        display: block;
        position: absolute;
        width: 0;
        height: 1px;
        border-radius: 2px;
        background-color: currentColor;
        top: 0;
        left: 0;
        transform: rotateZ(36deg);
        transform-origin: top left;
        transition: .2s;
      }
      &.hide::after {
        width: 18px;
      }
    }
    .remove {
      display: none;
      &:hover {
        color: $colorDanger;
      }
    }
  }
}
</style>
