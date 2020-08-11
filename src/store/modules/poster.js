import * as MTS from './poster.mutations'
// import { Message } from 'element-ui'
import { Widget, BackgroundWidget, CopiedWidget } from 'poster/widgetHelpers'
import { arrMoveTop, arrMoveUpper, arrMoveLower, arrMoveBottom } from '@/utils/posterUtils'

const state = {
    canvasSize: {
        width: null,
        height: null
    },
    canvasPosition: {
        top: null,
        left: null
    },
    background: null,
    posterItems: [], // 组件列表
    activeItems: [], // 当前选中的组件
    layerPanelOpened: false, // 是否打开图层面板
    copiedWidgets: null, // 当前复制的组件 WidgetItem[]
    referenceLine: { // 参考线,用户定义的参考线
        row: [],
        col: []
    },
    matchedLine: null // 匹配到的参考西安 {row:[],col:[]}
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
    [MTS.SET_CANVAS_SIZE](state, data) {
        state.canvasSize = data
    },
    [MTS.SET_CANVAS_POSITION](state, data) {
        state.canvasPosition = data
    },
    [MTS.ADD_BACKGROUND](state, item) {
        state.background = item
    },
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
        if (item.couldAddToActive) {
            state.activeItems.push(item)
        }
    },
    // 取消选中
    [MTS.REMOVE_ACTIVE_ITEM](state, item) {
        state.activeItems = state.activeItems.filter(i => i.id !== item.id)
    },
    // 替换选中的组件
    [MTS.REPLACE_ACTIVE_ITEMS](state, items) {
        state.activeItems = items.filter(i => i.couldAddToActive)
    },
    // 设置图层面板的打开关闭状态
    [MTS.SET_LAYER_PANEL](state, flag) {
        state.layerPanelOpened = !!flag
    },
    // 设置某个组件的data
    [MTS.SET_WIDGET_CONFIG](state, { item, cb }) {
        const target = state.posterItems.find(i => i.id === item.id)
        if (target && cb) {
            cb(target)
        }
    },
    // 复制组件
    [MTS.COPY_WIDGET](state, item) {
        const items = Array.isArray(item) ? item : [item]
        const finalItems = items.filter(i => i && i.replicable)
        state.copiedWidgets = finalItems.length > 0 ? finalItems : null
    },
    // 粘贴组件
    [MTS.PASTE_WIDGET](state) {
        const copiedWidgets = state.copiedWidgets
        if (copiedWidgets && copiedWidgets.length > 0) {
            copiedWidgets.forEach(item => {
                state.posterItems.push(new CopiedWidget(item))
            })
        }
    },
    [MTS.ADD_REFERENCE_LINE](state, { type, position }) {
        state.referenceLine[type].push(position)
    },
    [MTS.REMOVE_REFERENCE_LINE](state, { type, index }) {
        state.referenceLine[type].splice(index, 1)
    },
    [MTS.SET_MATCHED_LINE](state, data) {
        state.matchedLine = data
    },
    [MTS.REMOVE_MATCHED_LINE](state) {
        state.matchedLine = null
    }
}

const actions = {
    addBackground({ commit }, item) {
        if (item instanceof BackgroundWidget) {
            commit(MTS.ADD_BACKGROUND, item)
        }
    },
    removeBackground({ state }) {
        state.background = new BackgroundWidget({
            backgroundColor: '#fff',
            isSolid: true,
            lock: true
        })
    },
    setBackgroundConfig({ state }, cb) {
        if (state.background) {
            cb(state.background)
        }
    },
    addItem({ commit }, item) {
        if (item instanceof Widget) {
            commit(MTS.ADD_ITEM, item)
        }
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
        commit(MTS.REPLACE_POSTER_ITEMS, items)
        commit(MTS.REPLACE_ACTIVE_ITEMS, [])
    },
    addActiveItem({ commit, getters }, item) {
        if (item.lock || !item.visible) {
            return
        }
        if (getters.activeItemIds.includes(item.id)) {
            return
        }
        commit(MTS.ADD_ACTIVE_ITEM, item)
    },
    removeActiveItem({ commit }, item) {
        commit(MTS.REMOVE_ACTIVE_ITEM, item)
    },
    // 切换组件的选中状态
    toggleActiveItem({ commit, getters }, item) {
        if (item.lock || !item.visible) {
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
    replaceActiveItems({ commit, dispatch }, items) {
        if (items.length === 1) {
            commit(MTS.REPLACE_ACTIVE_ITEMS, [])
            dispatch('addActiveItem', items[0])
        } else {
            commit(MTS.REPLACE_ACTIVE_ITEMS, items.filter(i => !i.lock))
        }
    },
    setLayerPanel({ commit }, flag) {
        commit(MTS.SET_LAYER_PANEL, flag)
    },
    setWidgetConfig({ commit }, { item, cb }) {
        commit(MTS.SET_WIDGET_CONFIG, { item, cb })
    },
    lockItem({ commit, getters }, item) {
        if (getters.activeItemIds.includes(item.id)) {
            commit(MTS.REMOVE_ACTIVE_ITEM, item)
        }
        commit(MTS.SET_WIDGET_CONFIG, { item, cb: (i) => (i.lock = true) })
    },
    unlockItem({ commit }, item) {
        commit(MTS.SET_WIDGET_CONFIG, { item, cb: (i) => (i.lock = false) })
    },
    toggleItemVisible({ commit }, { item, visible }) {
        commit(MTS.SET_WIDGET_CONFIG, { item, cb: (i) => (i.visible = !!visible) })
    },
    widgetMoveToTop({ commit, state }, item) {
        commit(
            MTS.REPLACE_POSTER_ITEMS,
            arrMoveBottom(state.posterItems, state.posterItems.findIndex(i => i.id === item.id))
        )
    },
    widgetMoveToUpper({ commit, state }, item) {
        commit(
            MTS.REPLACE_POSTER_ITEMS,
            arrMoveLower(state.posterItems, state.posterItems.findIndex(i => i.id === item.id))
        )
    },
    widgetMoveToLower({ commit, state }, item) {
        commit(
            MTS.REPLACE_POSTER_ITEMS,
            arrMoveUpper(state.posterItems, state.posterItems.findIndex(i => i.id === item.id))
        )
    },
    widgetMoveToBottom({ commit, state }, item) {
        commit(
            MTS.REPLACE_POSTER_ITEMS,
            arrMoveTop(state.posterItems, state.posterItems.findIndex(i => i.id === item.id))
        )
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
