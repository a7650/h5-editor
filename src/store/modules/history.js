import _cloneDeep from 'lodash/cloneDeep'

const state = {
    maxHistoryStackLength: 30,
    preStack: [],
    nextStack: [],
    current: null
}

const actions = {
    setMaxHistory({ state }, n) {
        const _n = parseInt(n)
        if (_n) {
            state.maxHistoryStackLength = _n
        }
    },
    push({ state, rootState }) {
        const posterState = rootState.poster
        const snapshotState = {
            background: posterState.background,
            posterItems: posterState.posterItems,
            referenceLine: posterState.referenceLine
        }
        state.preStack.push(_cloneDeep(snapshotState))
        if (state.preStack.length > state.maxHistoryStackLength) {
            state.preStack.shift()
        }
        state.nextStack = []
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
    actions
}
