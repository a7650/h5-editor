/* eslint-disable new-cap */
import { Message } from 'element-ui'
import BackupService from 'poster/service/backupService'
import constructorMap from 'poster/widgetConstructor/constructorMap'
import { pluginConstructorMap } from 'poster/plugins'
import { getEditorConfig, saveEditorConfig } from './helpers'

function getState() {
    const editorConfig = getEditorConfig()
    const state = {
        useBackup: false, // 是否使用备份功能，数据库不存在/数据库被禁止使用等情况下，将会关闭备份功能
        autoSaveTimer: null,
        autoSave: editorConfig['backup.autoSave'],
        autoSaveDivision: editorConfig['backup.autoSaveDivision'],
        lastBackup: null // {createTime:0,id:''}
    }
    return state
}

const state = getState()

const getters = {
    smartBackup(state) {
        return state.useBackup && state.autoSave && !state.autoSaveDivision
    }
}

const actions = {
    resetState({ state, dispatch }) {
        dispatch('killAutoSaveTask')
        for (const [key, val] of Object.entries(getState())) {
            state[key] = val
        }
        dispatch('init')
    },
    toggleAutoSave({ state, dispatch }, autoSave) {
        state.autoSave = autoSave
        saveEditorConfig({ 'backup.autoSave': autoSave })
        if (autoSave) {
            dispatch('startAutoSaveTask')
        } else {
            dispatch('killAutoSaveTask')
        }
    },
    changeAutoSaveDivision({ state, dispatch }, value) {
        state.autoSaveDivision = value
        saveEditorConfig({ 'backup.autoSaveDivision': value })
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
    /**
     * 恢复数据
     * 如果有initialBackupData则使用initialBackupData，否则取上次备份的数据
     */
    async recover({ state, rootState, dispatch }, initialBackupData) {
        if ((!state.lastBackup) && (!initialBackupData)) {
            return
        }
        const backupData = initialBackupData || (await BackupService.getBackupData(state.lastBackup.id)).backupData
        if (backupData) {
            const allConstructorMap = {
                ...constructorMap,
                ...pluginConstructorMap
            }
            let posterItems = backupData.posterItems
            let background = backupData.background
            if (posterItems && posterItems.length > 0) {
                posterItems = posterItems.map(item => {
                    const widget = new allConstructorMap[item.type](item)
                    widget._isBackup = true
                    return widget
                })
            }
            if (background) {
                background = new allConstructorMap.background(background)
            }
            dispatch('poster/history/push', null, { root: true })
            rootState.poster = Object.assign(
                {},
                rootState.poster,
                backupData,
                { background, posterItems }
            )
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
