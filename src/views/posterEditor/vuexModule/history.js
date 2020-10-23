import _cloneDeep from 'lodash/cloneDeep'
import { getEditorConfig, saveEditorConfig } from './helpers'

function getState() {
    const editorConfig = getEditorConfig()
    const state = {
        maxHistoryStackLength: editorConfig['history.maxHistoryStackLength'],
        preStack: [],
        nextStack: [],
        lastBackupStepCount: 0 // 距离上次备份的步数
    }
    return state
}

const state = getState()

const getters = {
    current(state, getters, rootState) {
        const posterState = rootState.poster
        const snapshotState = {
            background: posterState.background,
            posterItems: posterState.posterItems,
            referenceLine: posterState.referenceLine
        }
        return snapshotState
    }
}

const actions = {
    resetState({ state }) {
        for (const [key, val] of Object.entries(getState())) {
            state[key] = val
        }
    },
    setMaxHistory({ state }, n) {
        const _n = parseInt(n)
        if (_n) {
            state.maxHistoryStackLength = Math.min(50, _n)
            saveEditorConfig({ 'history.maxHistoryStackLength': state.maxHistoryStackLength })
        }
    },
    push({ state, getters, rootGetters, dispatch }) {
        const snapshotState = getters.current
        state.preStack.push(_cloneDeep(snapshotState))
        if (state.preStack.length > state.maxHistoryStackLength) {
            state.preStack.shift()
        }
        state.nextStack = []
        state.lastBackupStepCount += 1
        dispatch('poster/setUnsavedState', true, { root: true })
        if (rootGetters['poster/backup/smartBackup'] && state.lastBackupStepCount > 10) {
            dispatch('poster/backup/invoker', false/** close tip */, { root: true })
        }
    },
    undo({ state, rootState }) {
        if (state.preStack.length > 0) {
            const preState = state.preStack.pop()
            state.nextStack.unshift({
                background: rootState.poster.background,
                posterItems: rootState.poster.posterItems,
                referenceLine: rootState.poster.referenceLine
            })
            rootState.poster.background = preState.background
            rootState.poster.posterItems = preState.posterItems
            rootState.poster.referenceLine = preState.referenceLine
            rootState.poster.activeItems = []
        }
    },
    redo({ state, rootState }) {
        if (state.nextStack.length > 0) {
            const nextState = state.nextStack.shift()
            state.preStack.push({
                background: rootState.poster.background,
                posterItems: rootState.poster.posterItems,
                referenceLine: rootState.poster.referenceLine
            })
            rootState.poster.background = nextState.background
            rootState.poster.posterItems = nextState.posterItems
            rootState.poster.referenceLine = nextState.referenceLine
            rootState.poster.activeItems = []
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions
}
