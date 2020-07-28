const state = {
    posterItems: [],
    layerPanelOpened: false // 是否打开图层面板
}

const getters = {}

const mutations = {
    ADD_ITEM(state, item) {
        state.posterItems.push(item)
    },
    SET_LAYER_PANEL(state, flag) {
        state.layerPanelOpened = !!flag
    }
}

const actions = {

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
