import { Message } from 'element-ui'
import BackupService from 'poster/service/backupService'

const state = {
    autoSaveTimer: null,
    autoSave: true,
    autoSaveDivision: 1000 * 60 * 10
}

const actions = {
    toggleAutoSave({ state, dispatch }, autoSave) {
        state.autoSave = autoSave
        if (autoSave) {
            dispatch('startAutoSaveTask')
        } else {
            dispatch('killAutoSaveTask')
        }
    },
    changeAutoSaveDivision({ state, dispatch }, value) {
        state.autoSaveDivision = value
        dispatch('killAutoSaveTask')
        dispatch('startAutoSaveTask')
    },
    startAutoSaveTask({ state, dispatch }) {
        if (state.autoSave && state.autoSaveDivision) {
            state.autoSaveTimer = setInterval(() => {
                dispatch('invoker', false/** close tip */)
            }, state.autoSaveDivision)
            return () => {
                dispatch('killAutoSaveTask')
            }
        }
    },
    killAutoSaveTask({ state }) {
        if (state.autoSaveTimer) {
            clearInterval(state.autoSaveTimer)
            state.autoSaveTimer = null
        }
    },
    async recover({ rootState, dispatch }) {
        const backupDate = await BackupService.getBackupData()
        if (backupDate) {
            dispatch('poster/history/push', null, { root: true })
            rootState.poster = Object.assign({}, rootState.poster, backupDate)
        }
    },
    // 执行备份操作
    async invoker({ rootGetters }, openTip = true) {
        const coreData = rootGetters['poster/history/current']
        await BackupService.saveBackupData(coreData)
        if (openTip) {
            Message.success('已保存')
        }
        console.log(`编辑器数据已保存：${new Date()}`)
    }
}

export default {
    namespaced: true,
    state,
    actions
}
