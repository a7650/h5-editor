import _cloneDeep from 'lodash/cloneDeep'

// 最多保留之前的n步
const MAX_STACK_LEN = 30

const state = {
    preStack: [],
    nextStack: [],
    current: null
}

const actions = {
    push({ state, rootState }) {
        const posterState = rootState.poster
        const snapshotState = {
            background: posterState.background,
            posterItems: posterState.posterItems,
            referenceLine: posterState.referenceLine
        }
        state.preStack.push(_cloneDeep(snapshotState))
        if (state.preStack.length > MAX_STACK_LEN) {
            state.preStack.shift()
        }
        state.nextStack = []
        console.warn('history-push', state.preStack)
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
