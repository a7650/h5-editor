<template>
  <div class="image-control">
    <el-collapse v-model="activeNames">
      <!-- <el-collapse-item name="image">
        <template #title>
          <div class="header">
            图片
          </div>
        </template>
        <div class="setting-content">
          #tupian
        </div>
      </el-collapse-item> -->
      <el-collapse-item name="position">
        <template #title>
          <div class="header">
            位置
          </div>
        </template>
        <position-control :drag-info="dragInfo" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { commonMixin } from './common/mixins'

export default {
  mixins: [commonMixin],
  data() {
    return {
      activeNames: ['image', 'position']
    }
  }
}
</script>
<style lang="scss" scoped>
.image-control {
  width: 100%;
  .header {
    box-sizing: border-box;
    padding: 0 20px;
  }
  .setting-content {
    background-color: rgb(238, 238, 238);
    box-sizing: border-box;
    padding: 0 20px 10px;
  }
  .setting-item {
    .title {
    }
    .content {
      input {
        width: 100%;
        height: 34px;
        border: 1px solid rgb(117, 117, 117);
        box-sizing: border-box;
        padding: 0 4px;
      }
    }
  }
}
</style>
