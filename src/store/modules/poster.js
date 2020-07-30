import * as MTS from './poster.mutations'

const state = {
    posterItems: [], // 组件列表
    activeItems: [], // 当前选中的组件
    layerPanelOpened: false // 是否打开图层面板
}

const getters = {
    posterItemIds(state, getters) {
        return state.posterItems.map(item => item.id)
    },
    activeItemIds(state) {
        return state.activeItems.map(item => item.id)
    }
}

const mutations = {
    // 添加组件
    [MTS.ADD_ITEM](state, item) {
        state.posterItems.push(item)
    },
    // 删除组件
    [MTS.REMOVE_ITEM](state, item) {
        state.posterItems = state.posterItems.filter(i => i.id !== item.id)
    },
    // 替换所有items
    [MTS.REPLACE_POSTER_ITEMS](state, items) {
        state.posterItems = items
    },
    // 添加选中的组件
    [MTS.ADD_ACTIVE_ITEM](state, item) {
        state.activeItems.push(item)
    },
    // 取消选中
    [MTS.REMOVE_ACTIVE_ITEM](state, item) {
        state.activeItems = state.activeItems.filter(i => i.id !== item.id)
    },
    // 替换选中的组件
    [MTS.REPLACE_ACTIVE_ITEMS](state, items) {
        state.activeItems = items
    },
    // 设置图层面板的打开关闭状态
    [MTS.SET_LAYER_PANEL](state, flag) {
        state.layerPanelOpened = !!flag
    }
}

const actions = {
    addItem({ commit }, item) {
        commit(MTS.ADD_ITEM, item)
    },
    removeItem({ commit, getters }, item) {
        if (item.lock) {
            return
        }
        if (getters.activeItemIds.includes(item.id)) {
            commit(MTS.REMOVE_ACTIVE_ITEM, item)
        }
        commit(MTS.REMOVE_ITEM, item)
    },
    replacePosterItems({ commit }, items) {
        commit(MTS.REPLACE_POSTER_ITEMS, items.filter(i => !i.lock))
        commit(MTS.REPLACE_ACTIVE_ITEMS, [])
    },
    addActiveItem({ commit, getters }, item) {
        if (item.lock || item.visible) {
            return
        }
        if (getters.activeItemIds.includes(item.id)) {
            commit(MTS.REMOVE_ACTIVE_ITEM, item)
        }
        commit(MTS.ADD_ACTIVE_ITEM, item)
    },
    removeActiveItem({ commit }, item) {
        commit(MTS.REMOVE_ACTIVE_ITEM, item)
    },
    // 切换组件的选中状态
    toggleActiveItem({ commit, getters }, item) {
        if (item.lock || item.visible) {
            return
        }
        if (!getters.posterItemIds.includes(item.id)) {
            return
        }
        if (getters.activeItemIds.includes(item.id)) {
            commit(MTS.REMOVE_ACTIVE_ITEM, item)
        } else {
            commit(MTS.ADD_ACTIVE_ITEM, item)
        }
    },
    replaceActiveItems({ commit }, items) {
        commit(MTS.REPLACE_ACTIVE_ITEMS, items.filter(i => !i.lock))
    },
    setLayerPanel({ commit }, flag) {
        commit(MTS.SET_LAYER_PANEL, flag)
    },
    lockItem({ commit, state, getters }, item) {
        if (getters.activeItemIds.includes(item.id)) {
            commit(MTS.REMOVE_ACTIVE_ITEM, item)
        }
        commit(MTS.REPLACE_POSTER_ITEMS, state.posterItems.map(i => {
            if (i.id === item.id) {
                i.lock = true
            }
            return i
        }))
    },
    unlockItem({ commit }, item) {
        commit(MTS.REPLACE_POSTER_ITEMS, state.posterItems.map(i => {
            if (i.id === item.id) {
                i.lock = false
            }
            return i
        }))
    },
    toggleVisible({ commit }, { item, visible }) {
        commit(MTS.REPLACE_POSTER_ITEMS, state.posterItems.map(i => {
            if (i.id === item.id) {
                i.visible = !!visible
            }
            return i
        }))
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
