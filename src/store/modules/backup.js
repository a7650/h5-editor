import { Message } from 'element-ui'
import BackupService from 'poster/service/backupService'

const state = {
    useBackup: false, // 是否使用备份功能，数据库不存在/数据库被禁止使用等情况下，将会关闭备份功能
    autoSaveTimer: null,
    autoSave: true,
    autoSaveDivision: 1000 * 60 * 10,
    lastBackup: null // {createTime:0,id:''}
}

const getters = {
    smartBackup(state) {
        return state.useBackup && state.autoSave && !state.autoSaveDivision
    }
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
    async recover({ state, rootState, dispatch }) {
        if (!state.lastBackup) {
            return
        }
        const backupData = (await BackupService.getBackupData(state.lastBackup.id)).backupData
        if (backupData) {
            dispatch('poster/history/push', null, { root: true })
            rootState.poster = Object.assign({}, rootState.poster, backupData)
        }
    },
    async init({ state, dispatch }) {
        try {
            state.useBackup = await BackupService.init()
            dispatch('startAutoSaveTask')
            dispatch('refresh')
        } catch (e) {
            console.error(e)
            state.useBackup = false
        }
    },
    async refresh({ state }) {
        state.lastBackup = await BackupService.getLastBackup()
    },
    // 执行备份操作
    async invoker({ rootState, rootGetters, dispatch }, openTip = true) {
        const coreData = rootGetters['poster/history/current']
        await BackupService.saveBackupData(coreData)
        rootState.poster.backup.lastBackupStepCount = 0
        dispatch('refresh')
        if (openTip) {
            Message.success('已保存')
        }
        console.log(`编辑器数据已保存：${new Date()}`)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions
}
