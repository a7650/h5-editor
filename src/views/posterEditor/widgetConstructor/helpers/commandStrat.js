import store from '@/store'

/**
 * 获取复制组件的数据
 */
export function getCopyData(item, vm) {
    const stateJson = vm ? JSON.stringify(vm.$data) : null
    return {
        ...JSON.parse(JSON.stringify(item)),
        initHook: item.initHook,
        _codeGen: item._codeGen,
        componentState: function() {
            return stateJson && JSON.parse(stateJson)
        }
    }
}

/**
 * $开头表示是内部命令，以便和组件自定义命令区分
 */
export const baseCommandStrat = {
    $moveToTop(item) {
        store.dispatch('poster/widgetMoveToTop', item)
    },
    $moveToUpper(item) {
        store.dispatch('poster/widgetMoveToUpper', item)
    },
    $moveToLower(item) {
        store.dispatch('poster/widgetMoveToLower', item)
    },
    $moveToBottom(item) {
        store.dispatch('poster/widgetMoveToBottom', item)
    },
    $remove(item) {
        store.dispatch('poster/removeItem', item)
    },
    $lock(item) {
        store.dispatch('poster/lockItem', item)
    },
    $unlock(item) {
        store.dispatch('poster/unlockItem', item)
    },
    $copy(item, vm) {
        store.dispatch('poster/copyWidget', getCopyData(item, vm))
    }
}

export const baseMenuList = [
    {
        label: '复制',
        command: '$copy'
    },
    {
        label: '置于顶层',
        command: '$moveToTop'
    },
    {
        label: '上移一层',
        command: '$moveToUpper'
    },
    {
        label: '下移一层',
        command: '$moveToLower'
    },
    {
        label: '置于底层',
        command: '$moveToBottom'
    },
    {
        label: '删除',
        command: '$remove'
    }
]
