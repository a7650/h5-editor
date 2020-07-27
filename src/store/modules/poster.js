const state = {
    posterItems: []
}

const getters = {}

const mutations = {
    ADD_ITEM(state, item) {
        state.posterItems.push(item)
    }
}

const actions = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
