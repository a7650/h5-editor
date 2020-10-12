<template>
  <div class="data-backup">
    <el-form size="small">
      <el-form-item label="打开自动备份">
        <el-checkbox v-model="autoSave" />
      </el-form-item>
      <el-form-item label="自动备份时间间隔">
        <el-select
          v-model="autoSaveDivision"
          placeholder="请选择"
          :disabled="!autoSave"
        >
          <el-option
            v-for="item in autoSaveDivisionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div v-if="!autoSaveDivision" style="font-size:12px">
          系统会在合适的时机进行备份
        </div>
      </el-form-item>
      <el-form-item label="备份记录">
        <span>{{ `上次备份：${lastBackupTime || '无'}` }}</span>
        <span v-if="lastBackup" class="recover" @click="recover(null)">恢复数据</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'poster/poster.vuex'
export default {
  data() {
    return {
      autoSaveDivisionOptions: [
        {
          label: '智能备份',
          value: ''
        },
        {
          label: '5分钟',
          value: 1000 * 60 * 5
        },
        {
          label: '10分钟',
          value: 1000 * 60 * 10
        },
        {
          label: '20分钟',
          value: 1000 * 60 * 20
        },
        {
          label: '30分钟',
          value: 1000 * 60 * 30
        }
      ]
    }
  },
  computed: {
    ...mapState({
      _autoSave: (state) => state.backup.autoSave,
      _autoSaveDivision: (state) => state.backup.autoSaveDivision,
      lastBackup: state => state.backup.lastBackup
    }),
    autoSave: {
      get() {
        return this._autoSave
      },
      set(val) {
        this.toggleAutoSave(val)
      }
    },
    autoSaveDivision: {
      get() {
        return this._autoSaveDivision
      },
      set(val) {
        this.changeAutoSaveDivision(val)
      }
    },
    lastBackupTime() {
      if (!this.lastBackup) {
        return null
      }
      return this.$moment(this.lastBackup.createTime).format('MM-DD HH:mm:ss')
    }
  },
  watch: {
    autoSaveDivision: {
      handler(newVal) {}
    }
  },
  methods: {
    ...mapActions({
      toggleAutoSave: 'backup/toggleAutoSave',
      changeAutoSaveDivision: 'backup/changeAutoSaveDivision',
      recover: 'backup/recover'
    })
  }
}
</script>
<style lang="scss" scoped>
.data-backup {
  .recover {
    margin-left: 10px;
    color: $colorTheme;
    cursor: pointer;
  }
}
</style>
