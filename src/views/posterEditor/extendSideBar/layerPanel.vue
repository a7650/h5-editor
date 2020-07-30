<template>
  <div id="layer-panel" class="layer-panel">
    <div v-drag:#layer-panel class="header">
      <div class="title">图层面板</div>
      <i class="el-icon-close" @click="close" />
    </div>
    <div class="content">
      <el-scrollbar
        ref="scrollContainer"
        :vertical="true"
        class="scroll-container"
      >
        <draggable
          v-model="inPosterItems"
          :options="{ animation: 200 }"
          class="draggable-container"
        >
          <div
            v-for="item in inPosterItems"
            :key="item.id"
            class="item"
            :class="{ selected: activeItemIds.includes(item.id) }"
            @click="select(item)"
          >
            <i :class="item.icon" class="icon" :title="item.typeLabel" />
            <div class="name">{{ item.id }}</div>
            <div class="handle">
              <i
                class="el-icon-delete-solid remove"
                :title="item.lock ? '已锁定，无法删除' : '删除'"
                @click.stop="remove(item)"
              />
              <i
                v-if="!item.lock"
                class="el-icon-unlock"
                title="锁定"
                @click.stop="lock(item)"
              />
              <i
                v-else
                class="el-icon-lock"
                title="解除锁定"
                @click.stop="unlock(item)"
              />
              <i class="el-icon-view" title="隐藏" @click.stop="hide(item)" />
            </div>
          </div>
        </draggable>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'poster/poster.vuex'
import { drag } from 'poster/poster.directives'
import draggable from 'vuedraggable'

export default {
  components: { draggable },
  directives: { drag },
  data() {
    return {}
  },
  computed: {
    ...mapState(['posterItems']),
    ...mapGetters(['activeItemIds']),
    inPosterItems: {
      get() {
        return [...this.posterItems].reverse()
      },
      set(val) {
        this.REPLACE_POSTER_ITEMS([...val].reverse())
      }
    }
  },
  watch: {
    inPosterItems() {
      console.log(this.inPosterItems, this.posterItems)
    }
  },
  methods: {
    ...mapMutations(['REPLACE_POSTER_ITEMS']),
    ...mapActions([
      'addActiveItem',
      'toggleActiveItem',
      'replaceActiveItems',
      'removeItem',
      'lockItem',
      'unlockItem',
      'toggleVisible',
      'setLayerPanel'
    ]),
    close() {
      this.setLayerPanel(false)
    },
    select(item) {
      this.replaceActiveItems([item])
    },
    remove(item) {
      this.removeItem(item)
    },
    lock(item) {
      this.lockItem(item)
    },
    unlock(item) {
      this.unlockItem(item)
    },
    hide(item) {
      this.toggleVisible({ item, visible: !item.visible })
    }
  }
}
</script>
<style lang="scss" scoped>
.layer-panel {
  width: 220px;
  height: 460px;
  background-color: #1d2024;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0 0 6px rgba($color: #000000, $alpha: 0.1);
  color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  user-select: none;
  .header {
    height: 30px;
    display: flex;
    align-items: center;
    line-height: 30px;
    box-sizing: border-box;
    padding-left: 10px;
    .title {
      height: 30px;
      flex: 1;
      cursor: move;
    }
    i {
      cursor: pointer;
      width: 30px;
      text-align: center;
      padding: 10px 0;
    }
  }
  .content {
    width: 100%;
    flex: 1;
    /* overflow-y: scroll; */
    background-color: #1d2024;
    .draggable-container {
      height: 100%;
    }
    .scroll-container {
      height: 100%;
      ::v-deep .el-scrollbar__wrap {
        overflow-x: hidden;
        height: 430px;
      }
    }
    .item {
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
      &.selected {
        background-color: #404955;
        color: #fff;
        border-left-color: #358dd9;
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
        .remove {
          display: none;
          &:hover {
            color: $colorDanger;
          }
        }
      }
    }
  }
}
</style>
