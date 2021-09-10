import * as MTS from './poster.mutations'
// import { Message } from 'element-ui'
import { Widget, BackgroundWidget, CopiedWidget } from 'poster/widgetConstructor'
import { arrMoveTop, arrMoveUpper, arrMoveLower, arrMoveBottom } from 'poster/utils'
import { isPlainObject } from '@/utils'
import _set from 'lodash/set'
import { changeCompositionPositionHandler } from './helpers'
import history from './history'
import backup from './backup'
import { addActivityPageConfig } from '@/api/activity'
import { Message } from 'element-ui'

function getState() {
    const state = {
        activityId: '',
        pageConfigId: '',
        pageTitle: '',
        canvasSize: {
            width: 338,
            height: 600
        },
        canvasPosition: {
            top: null,
            left: null
        },
        background: null,
        posterItems: [], // 组件列表
        activeItems: [], // 当前选中的组件
        assistWidgets: [], // 辅助组件
        layerPanelOpened: true, // 是否打开图层面板
        referenceLineOpened: true, // 是否打开参考线
        copiedWidgets: null, // 当前复制的组件 WidgetItem[]
        referenceLine: { // 参考线,用户定义的参考线
            row: [],
            col: []
        },
        matchedLine: null, // 匹配到的参考线 {row:[],col:[]}
        mainPanelScrollY: 0,
        isUnsavedState: false // 是否处于未保存状态
    }
    return state
}

const state = getState()

const getters = {
    posterItemIds(state, getters) {
        return state.posterItems.map(item => item.id)
    },
    activeItemIds(state) {
        return state.activeItems.map(item => item.id)
    },
    canvasSize(state) {
        return state.canvasSize
    },
    activityId(state) {
        return state.activityId
    }
}

const mutations = {
    [MTS.SET_ACTIVITY_ID](state, id) {
        state.activityId = id
    },
    [MTS.SET_PAGE_CONFIG_ID](state, id) {
        state.pageConfigId = id
    },
    [MTS.SET_PAGE_TITLE](state, title) {
        state.pageTitle = title
        state.isUnsavedState = true
    },
    'SET_SCROLL_Y'(state, y) {
        state.mainPanelScrollY = y
    },
    [MTS.SET_CANVAS_POSITION](state, data) {
        state.canvasPosition = data
    },
    [MTS.ADD_BACKGROUND](state, item) {
        if (item instanceof BackgroundWidget) {
            state.background = item
        }
    },
    [MTS.REMOVE_BACKGROUND](state) {
        state.background = new BackgroundWidget()
    },
    [MTS.SET_BACKGROUND_CONFIG](state, cb) {
        if (state.background) {
            cb(state.background)
        }
    },
    // 添加组件
    [MTS.ADD_ITEM](state, item) {
        if (item instanceof Widget) {
            state.posterItems.push(item)
        }
    },
    // 删除组件
    [MTS.REMOVE_ITEM](state, item) {
        if (item.lock) {
            return
        }
        state.posterItems = state.posterItems.filter(i => i.id !== item.id)
    },
    // 替换所有items
    [MTS.REPLACE_POSTER_ITEMS](state, items) {
        state.posterItems = items
    },
    // 添加选中的组件
    [MTS.ADD_ACTIVE_ITEM](state, item) {
        if (item.lock || !item.visible || !item.couldAddToActive) {
            return
        }
        state.activeItems.push(item)
    },
    // 取消选中
    [MTS.REMOVE_ACTIVE_ITEM](state, item) {
        state.activeItems = state.activeItems.filter(i => i.id !== item.id)
    },
    // 替换选中的组件
    [MTS.REPLACE_ACTIVE_ITEMS](state, items) {
        state.activeItems = items.filter(i => (!i.lock) && i.couldAddToActive)
    },
    // 添加辅助组件
    [MTS.ADD_ASSIST_WIDGET](state, item) {
        state.assistWidgets.push(item)
    },
    // 删除辅助组件
    [MTS.REMOVE_ASSIST_WIDGET](state, item) {
        state.assistWidgets = state.assistWidgets.filter(i => i.id !== item.id)
    },
    // 替换辅助组件
    [MTS.REPLACE_ASSIST_WIDGETS](state, items) {
        state.assistWidgets = items
    },
    // 设置图层面板的打开关闭状态
    [MTS.SET_LAYER_PANEL](state, flag) {
        state.layerPanelOpened = !!flag
    },
    // 设置参考线的可见状态
    [MTS.SET_REFERENCE_LINE_VISIBLE](state, flag) {
        state.referenceLineOpened = !!flag
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
        const finalItems = items
            .filter(i => i && i.replicable)
            .map(i => {
                i._copyCount = 0
                return i
            })
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
    // 添加参考线
    [MTS.ADD_REFERENCE_LINE](state, { type, position }) {
        state.referenceLine[type].push(position)
    },
    // 删除参考线
    [MTS.REMOVE_REFERENCE_LINE](state, { type, index }) {
        state.referenceLine[type].splice(index, 1)
    },
    // 清空参考线
    [MTS.REMOVE_ALL_REFERENCE_LINE](state) {
        state.referenceLine = {
            row: [],
            col: []
        }
    },
    [MTS.SET_MATCHED_LINE](state, data) {
        state.matchedLine = data
    },
    [MTS.REMOVE_MATCHED_LINE](state) {
        state.matchedLine = null
    },
    [MTS.SET_UNSAVED_STATE](state, flag = false) {
        state.isUnsavedState = flag
    }

}

const actions = {
    resetState({ state, dispatch }) {
        return new Promise((resolve) => {
            for (const [key, val] of Object.entries(getState())) {
                state[key] = val
            }
            dispatch('backup/resetState')
            dispatch('history/resetState')
            setTimeout(() => {
                resolve()
            }, 500)
        })
    },
    setUnsavedState({ commit }, flag) {
        commit(MTS.SET_UNSAVED_STATE, flag)
    },
    setCanvasSize({ state, dispatch }, data) {
        // dispatch('history/push')
        state.canvasSize = data
    },
    addBackground({ state, commit, dispatch }, item) {
        if (state.background) {
            dispatch('history/push')
        }
        commit(MTS.ADD_BACKGROUND, item)
    },
    removeBackground({ commit, dispatch }) {
        dispatch('history/push')
        commit(MTS.REMOVE_BACKGROUND)
    },
    setBackgroundConfig({ state, commit, dispatch }, cb) {
        dispatch('history/push')
        commit(MTS.SET_BACKGROUND_CONFIG, cb)
    },
    seekBackgroundSize({ state }) {
        const background = state.background
        if (background && background.wState.isSolid) {
            background.dragInfo.w = state.canvasSize.width
            background.dragInfo.h = state.canvasSize.height
        }
    },
    addItem({ commit, dispatch, state }, item) {
        const widgetCountLimit = parseInt(item._widgetCountLimit)
        if (widgetCountLimit) {
            const currentCount = (state.posterItems.filter(i => i.type === item.type)).length
            if (currentCount >= widgetCountLimit) {
                Message.error(`<${item.typeLabel || item.type}>类型的组件最多有${widgetCountLimit}个`)
                return
            }
        }
        if (item instanceof Widget) {
            dispatch('history/push')
            if (!(item instanceof CopiedWidget)) {
                commit(MTS.REPLACE_ACTIVE_ITEMS, [item])
            }
            commit(MTS.ADD_ITEM, item)
        }
    },
    removeItem({ commit, getters, dispatch }, item) {
        if (item.lock) {
            return
        }
        if (getters.activeItemIds.includes(item.id)) {
            commit(MTS.REMOVE_ACTIVE_ITEM, item)
        }
        dispatch('history/push')
        commit(MTS.REMOVE_ITEM, item)
    },
    replacePosterItems({ commit, dispatch }, items) {
        dispatch('history/push')
        commit(MTS.REPLACE_POSTER_ITEMS, items)
        commit(MTS.REPLACE_ACTIVE_ITEMS, [])
    },
    addActiveItem({ commit, getters, dispatch }, item) {
        if (getters.activeItemIds.includes(item.id)) {
            return
        }
        commit(MTS.ADD_ACTIVE_ITEM, item)
    },
    removeActiveItem({ commit, dispatch }, item) {
        commit(MTS.REMOVE_ACTIVE_ITEM, item)
    },
    replaceActiveItems({ commit }, items) {
        commit(MTS.REPLACE_ACTIVE_ITEMS, items)
    },
    addAssistWidget({ commit }, item) {
        // dispatch('history/push')
        commit(MTS.ADD_ASSIST_WIDGET, item)
    },
    removeAssistWidget({ commit }, item) {
        // dispatch('history/push')
        commit(MTS.REMOVE_ASSIST_WIDGET, item)
    },
    replaceAssistWidgets({ commit }, items) {
        // dispatch('history/push')
        commit(MTS.REPLACE_ASSIST_WIDGETS, items)
    },
    selectAllItems({ commit, state }) {
        commit(MTS.REPLACE_ACTIVE_ITEMS, state.posterItems)
    },
    setLayerPanel({ commit }, flag) {
        commit(MTS.SET_LAYER_PANEL, flag)
    },
    updateBackgroundDragInfo({ state }, dragInfo) {
        state.background.dragInfo = Object.assign({}, state.background.dragInfo, dragInfo)
    },
    // 更新组件位置、大小等
    updateDragInfo({ state }, { dragInfo, widgetId, updateSelfOnly = false }) {
        const widgetItem = state.posterItems.find(i => i.id === widgetId)
        if (!widgetItem) {
            return
        }
        // if (isMoving) {
        const preDragInfo = widgetItem.dragInfo
        const activeItems = state.activeItems
        dragInfo = Object.assign({}, preDragInfo, dragInfo)
        if (updateSelfOnly) {
            widgetItem.dragInfo = Object.assign({}, widgetItem.dragInfo, dragInfo)
        } else if (activeItems.length > 0) {
            const diffDragInfo = {
                w: dragInfo.w - preDragInfo.w,
                h: dragInfo.h - preDragInfo.h,
                x: dragInfo.x - preDragInfo.x,
                y: dragInfo.y - preDragInfo.y,
                rotateZ: dragInfo.rotateZ - preDragInfo.rotateZ
            }
            activeItems.forEach(item => {
                const { x, y, w, h, rotateZ } = item.dragInfo
                item.dragInfo = {
                    x: x + diffDragInfo.x,
                    y: y + diffDragInfo.y,
                    w: w + diffDragInfo.w,
                    h: h + diffDragInfo.h,
                    rotateZ: rotateZ + diffDragInfo.rotateZ
                }
            })
        }
        // } else {
        //     widgetItem.dragInfo = Object.assign({}, widgetItem.dragInfo, dragInfo)
        // }
    },
    // 更新组件state
    updateWidgetState({ state, dispatch }, { keyPath, value, widgetId, pushHistory = true }) {
        const widgetItem = state.posterItems.find(i => i.id === widgetId)
        if (widgetItem) {
            // 某些操作不添加进历史记录栈
            if (pushHistory) {
                dispatch('history/push')
            }
            _set(widgetItem.wState, keyPath, value)
        }
    },
    // 更改组合的位置
    changeCompositionPosition({ state, dispatch }, type) {
        const activeItems = state.activeItems
        dispatch('history/push')
        /**
         * @sideEffect
         */
        changeCompositionPositionHandler(activeItems, type, state.canvasSize)
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
    widgetMoveToTop({ commit, state, dispatch }, item) {
        dispatch('history/push')
        commit(
            MTS.REPLACE_POSTER_ITEMS,
            arrMoveBottom(state.posterItems, state.posterItems.findIndex(i => i.id === item.id))
        )
    },
    widgetMoveToUpper({ commit, state, dispatch }, item) {
        dispatch('history/push')
        commit(
            MTS.REPLACE_POSTER_ITEMS,
            arrMoveLower(state.posterItems, state.posterItems.findIndex(i => i.id === item.id))
        )
    },
    widgetMoveToLower({ commit, state, dispatch }, item) {
        dispatch('history/push')
        commit(
            MTS.REPLACE_POSTER_ITEMS,
            arrMoveUpper(state.posterItems, state.posterItems.findIndex(i => i.id === item.id))
        )
    },
    widgetMoveToBottom({ commit, state, dispatch }, item) {
        dispatch('history/push')
        commit(
            MTS.REPLACE_POSTER_ITEMS,
            arrMoveTop(state.posterItems, state.posterItems.findIndex(i => i.id === item.id))
        )
    },
    copyWidget({ commit }, item) {
        commit(MTS.COPY_WIDGET, item)
    },
    pasteWidget({ commit, dispatch }) {
        dispatch('history/push')
        commit(MTS.PASTE_WIDGET)
    },
    addReferenceLine({ commit, dispatch }, item) {
        dispatch('history/push')
        commit(MTS.ADD_REFERENCE_LINE, item)
    },
    removeReferenceLine({ commit, dispatch }, item) {
        dispatch('history/push')
        commit(MTS.REMOVE_REFERENCE_LINE, item)
    },
    removeAllReferenceLine({ commit, dispatch }) {
        dispatch('history/push')
        commit(MTS.REMOVE_ALL_REFERENCE_LINE)
    },
    setReferenceLineVisible({ commit }, flag) {
        commit(MTS.SET_REFERENCE_LINE_VISIBLE, flag)
    },
    setMatchedLine({ commit }, data) {
        commit(MTS.SET_MATCHED_LINE, data)
    },
    removeMatchedLine({ commit }) {
        commit(MTS.REMOVE_MATCHED_LINE)
    },
    /**
     * 更新当前页面配置
     * 参数pageConfig是从后台获取到的页面配置信息
     */
    updatePageConfig({ dispatch, state, commit }, pageConfig) {
        let recoverData = {}
        if (!pageConfig || !isPlainObject(pageConfig)) {
            commit(MTS.SET_PAGE_CONFIG_ID, '')
            recoverData = {
                background: new BackgroundWidget(),
                posterItems: [],
                referenceLine: getState().referenceLine
            }
        } else {
            commit(MTS.SET_PAGE_CONFIG_ID, pageConfig.pageConfigId)
            const baseConfig = JSON.parse(pageConfig.config)
            const posterItems = pageConfig.items
            let background
            try {
                const backgroundItem = posterItems.splice(
                    posterItems.findIndex(i => i.type === 'background'), 1
                )[0]
                if (backgroundItem) {
                    background = JSON.parse(backgroundItem.config)
                }
            } catch (e) {
                console.error(e)
                background = new BackgroundWidget()
            }
            const defaultState = getState()
            recoverData = {
                background,
                posterItems: posterItems.map(item => JSON.parse(item.config)),
                referenceLine: baseConfig.referenceLine || defaultState.referenceLine,
                canvasSize: baseConfig.canvasSize || defaultState.canvasSize,
                pageTitle: pageConfig.title || ''
            }
        }
        dispatch('backup/recover', recoverData)
        commit(MTS.SET_UNSAVED_STATE, false)
    },
    /**
     * 保存/新增当前的活动页配置
     */
    saveActivityPageConfig({ state, commit, rootGetters }) {
        const requestData = {
            title: state.pageTitle,
            // baseConfig
            config: JSON.stringify({
                referenceLine: state.referenceLine,
                canvasSize: state.canvasSize
            }),
            items: [
                {
                    type: state.background.type,
                    content: '',
                    config: JSON.stringify(state.background)
                },
                ...state.posterItems.map((item, index) => {
                    return {
                        type: item.type,
                        content: '',
                        config: JSON.stringify({
                            ...item,
                            _sort: index + 1
                        })
                    }
                })
            ]
        }
        return addActivityPageConfig(requestData).then(
            res => {
                Message.success('保存成功')
                commit(MTS.SET_UNSAVED_STATE, false)
                return res
            },
            () => {
                Message.error('保存失败')
                return Promise.reject()
            }
        )
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    modules: {
        history,
        backup
    }
}
